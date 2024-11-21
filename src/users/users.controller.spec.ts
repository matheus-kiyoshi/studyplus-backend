import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { RequestPasswordUserDto } from './dto/request-password-reset.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { JwtService } from '@nestjs/jwt';

const now = new Date();

const result = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'test',
    password: '123456',
    token: 'fake-token',
    goal: 'goal',
    dailyTime: 1,
    totalHours: 1,
    createdAt: now,
  },
];

describe('UsersController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            updatePassword: jest.fn(),
            requestPasswordReset: jest.fn(),
            resetPassword: jest.fn(),
            findBySearchArg: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'fake-jwt-token'),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call UsersService.create with correct parameters', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: '123456',
      name: 'test',
    };
    jest.spyOn(service, 'create').mockResolvedValueOnce(createUserDto);
    expect(await controller.create(createUserDto)).toMatchObject(createUserDto);
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should call UsersService.findAll', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(result);
    expect(await controller.findAll()).toEqual(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call UsersService.findById with correct id', async () => {
    jest.spyOn(service, 'findById').mockResolvedValueOnce(result[0]);
    expect(await controller.findById(result[0].id)).toEqual(result[0]);
    expect(service.findById).toHaveBeenCalledWith(result[0].id);
  });

  // Protected Route
  it('should call UsersService.update with correct parameters', async () => {
    const updateUserDto: UpdateUserDto = { email: 'newemail@example.com' };
    const req = { user: { id: '1' } } as any;
    jest.spyOn(service, 'update').mockResolvedValueOnce({
      ...updateUserDto,
      password: undefined,
      email: 'newemail@example.com',
      name: 'test',
      id: '1',
      token: 'fake-token',
      goal: 'goal',
      dailyTime: 1,
      totalHours: 1,
      createdAt: now,
    });
    expect(await controller.update(req, updateUserDto)).toEqual({
      ...updateUserDto,
      password: undefined,
      email: 'newemail@example.com',
      name: 'test',
      id: '1',
      token: 'fake-token',
      goal: 'goal',
      dailyTime: 1,
      totalHours: 1,
      createdAt: now,
    });
    expect(service.update).toHaveBeenCalledWith(req.user.id, updateUserDto);
  });

  // Protected Route
  it('should call UsersService.remove with correct id', async () => {
    const req = { user: { id: '1' } } as any;
    jest.spyOn(service, 'remove').mockResolvedValueOnce('User deleted');
    expect(await controller.remove(req)).toEqual('User deleted');
    expect(service.remove).toHaveBeenCalledWith(req.user.id);
  });

  // Protected Route
  it('should call UsersService.updatePassword with correct parameters', async () => {
    const updatePasswordDto: UpdateUserPasswordDto = {
      currentPassword: '123456',
      newPassword: '654321',
    };
    const req = { user: { id: '1' } } as any;
    jest.spyOn(service, 'updatePassword').mockResolvedValueOnce({
      ...result[0],
      password: undefined,
    });
    expect(await controller.updatePassword(req, updatePasswordDto)).toEqual({
      ...result[0],
      password: undefined,
    });
    expect(service.updatePassword).toHaveBeenCalledWith(
      req.user.id,
      updatePasswordDto,
    );
  });

  // Protected Route
  it('should call UsersService.requestPasswordReset with correct email', async () => {
    const dto: RequestPasswordUserDto = { email: 'test@example.com' };
    jest.spyOn(service, 'requestPasswordReset').mockResolvedValueOnce(`a`);
    expect(typeof (await controller.requestPasswordRest(dto))).toBe('string');
    expect(service.requestPasswordReset).toHaveBeenCalledWith(dto.email);
  });

  // Protected Route
  it('should call UsersService.resetPassword with correct parameters', async () => {
    const dto: ResetPasswordUserDto = {
      id: '1',
      token: 'abc123',
      password: '654321',
    };
    jest.spyOn(service, 'resetPassword').mockResolvedValueOnce({
      ...result[0],
      password: undefined,
    });
    expect(await controller.resetPassword(dto)).toEqual({
      ...result[0],
      password: undefined,
    });
    expect(service.resetPassword).toHaveBeenCalledWith(dto);
  });

  // Protected Route
  it('should call UsersService.findBySearchArg with correct argument', async () => {
    const searchArg = 'example';
    jest.spyOn(service, 'findBySearchArg').mockResolvedValueOnce(result);
    expect(await controller.findBySearchArg(searchArg)).toEqual(result);
    expect(service.findBySearchArg).toHaveBeenCalledWith(searchArg);
  });

  it('should handle error when UsersService.create fails', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: '123456',
      name: 'test',
    };

    jest
      .spyOn(service, 'create')
      .mockRejectedValueOnce(new Error('Error creating user'));

    try {
      await controller.create(createUserDto);
    } catch (e) {
      expect(e.message).toBe('Error creating user');
    }
  });

  it('should handle error when UsersService.update fails', async () => {
    const updateUserDto: UpdateUserDto = { email: 'newemail@example.com' };
    const req = { user: { id: '1' } } as any;

    jest
      .spyOn(service, 'update')
      .mockRejectedValueOnce(new Error('Error updating user'));

    try {
      await controller.update(req, updateUserDto);
    } catch (e) {
      expect(e.message).toBe('Error updating user');
    }
  });

  it('should handle error when UsersService.remove fails', async () => {
    const req = { user: { id: '1' } } as any;

    jest
      .spyOn(service, 'remove')
      .mockRejectedValueOnce(new Error('Error deleting user'));

    try {
      await controller.remove(req);
    } catch (e) {
      expect(e.message).toBe('Error deleting user');
    }
  });

  it('should handle error when UsersService.updatePassword fails', async () => {
    const updatePasswordDto: UpdateUserPasswordDto = {
      currentPassword: '123456',
      newPassword: '654321',
    };
    const req = { user: { id: '1' } } as any;

    jest
      .spyOn(service, 'updatePassword')
      .mockRejectedValueOnce(new Error('Error updating password'));

    try {
      await controller.updatePassword(req, updatePasswordDto);
    } catch (e) {
      expect(e.message).toBe('Error updating password');
    }
  });

  it('should handle error when UsersService.requestPasswordReset fails', async () => {
    const dto: RequestPasswordUserDto = { email: 'test@example.com' };

    jest
      .spyOn(service, 'requestPasswordReset')
      .mockRejectedValueOnce(new Error('Error requesting password reset'));

    try {
      await controller.requestPasswordRest(dto);
    } catch (e) {
      expect(e.message).toBe('Error requesting password reset');
    }
  });

  it('should handle error when UsersService.resetPassword fails', async () => {
    const dto: ResetPasswordUserDto = {
      id: '1',
      token: 'abc123',
      password: '654321',
    };

    jest
      .spyOn(service, 'resetPassword')
      .mockRejectedValueOnce(new Error('Error resetting password'));

    try {
      await controller.resetPassword(dto);
    } catch (e) {
      expect(e.message).toBe('Error resetting password');
    }
  });
});
