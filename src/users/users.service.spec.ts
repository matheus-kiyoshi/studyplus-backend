import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import * as bcrypt from 'bcrypt';
import { sendEmail } from '../lib/utils/sendEmail';

jest.mock('../prisma/prisma.service');
jest.mock('../lib/utils/sendEmail');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue({
        ...createUserDto,
        id: '123',
        password: await bcrypt.hash(createUserDto.password, 10),
      });

      const result = await service.create(createUserDto);
      expect(result).toEqual({
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should throw an exception if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValue(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '123', email: 'test@example.com', name: 'Test User' },
      ];
      prismaService.user.findMany = jest.fn().mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
    });

    it('should throw an exception if no users found', async () => {
      prismaService.user.findMany = jest.fn().mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.findById('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw an exception if user not found', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findById('123')).rejects.toThrow(HttpException);
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const updatePasswordDto: UpdateUserPasswordDto = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword123',
      };
      const user = {
        id: '123',
        password: await bcrypt.hash('oldPassword', 10),
      };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
      prismaService.user.update = jest.fn().mockResolvedValue({
        id: '123',
        password: await bcrypt.hash('newPassword123', 10),
      });

      const result = await service.updatePassword('123', updatePasswordDto);
      expect(result.password).toBeUndefined();
      expect(result.id).toBe('123');
    });

    it('should throw an error if current password is incorrect', async () => {
      const updatePasswordDto: UpdateUserPasswordDto = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123',
      };
      const user = {
        id: '123',
        password: await bcrypt.hash('correctPassword', 10),
      };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);

      await expect(
        service.updatePassword('123', updatePasswordDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('requestPasswordReset', () => {
    it('should send a password reset email', async () => {
      const email = 'test@example.com';
      const user = { id: '123', email: 'test@example.com' };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
      prismaService.user.update = jest.fn().mockResolvedValue(user);

      (sendEmail as jest.Mock).mockResolvedValue(true);

      const link = await service.requestPasswordReset(email);
      expect(link).toContain('studyplus.com/passwordReset');

      expect(sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Password Reset Request',
        'Password Reset Request',
        expect.any(String),
      );
    });
  });
});
