import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlansController } from './study-plans.controller';
import { StudyPlansService } from './study-plans.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('StudyPlansController', () => {
  let controller: StudyPlansController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: StudyPlansService;

  const mockStudyPlansService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'userId123',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyPlansController],
      providers: [
        {
          provide: StudyPlansService,
          useValue: mockStudyPlansService,
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<StudyPlansController>(StudyPlansController);
    service = module.get<StudyPlansService>(StudyPlansService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a study plan successfully', async () => {
      const createStudyPlanDto = {
        name: 'New Plan',
        startDate: new Date('2024-01-01'),
        goal: 'Study hard',
      };
      mockStudyPlansService.create.mockResolvedValue({
        ...createStudyPlanDto,
        id: 'planId123',
        userId: mockRequest.user.id,
      });

      const result = await controller.create(
        mockRequest as any,
        createStudyPlanDto,
      );
      expect(result).toEqual({
        name: 'New Plan',
        startDate: new Date('2024-01-01'),
        goal: 'Study hard',
        id: 'planId123',
        userId: mockRequest.user.id,
      });
      expect(mockStudyPlansService.create).toHaveBeenCalledWith(
        mockRequest.user.id,
        createStudyPlanDto,
      );
    });

    it('should throw Unauthorized exception if no user id', async () => {
      const requestWithoutUser = { user: {} };
      const createStudyPlanDto = {
        name: 'New Plan',
        startDate: new Date('2024-01-01'),
        goal: 'Study hard',
      };

      try {
        await controller.create(requestWithoutUser as any, createStudyPlanDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Unauthorized');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('findAll', () => {
    it('should return all study plans for the user', async () => {
      const mockPlans = [
        { name: 'Plan 1', startDate: new Date('2024-01-01') },
        { name: 'Plan 2', startDate: '2024-02-01' },
      ];
      mockStudyPlansService.findAll.mockResolvedValue(mockPlans);

      const result = await controller.findAll(mockRequest as any);
      expect(result).toEqual(mockPlans);
      expect(mockStudyPlansService.findAll).toHaveBeenCalledWith(
        mockRequest.user.id,
      );
    });

    it('should throw Unauthorized exception if no user id', async () => {
      const requestWithoutUser = { user: {} };

      try {
        await controller.findAll(requestWithoutUser as any);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Unauthorized');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('findById', () => {
    it('should return a study plan by id', async () => {
      const mockPlan = { name: 'Plan 1', startDate: new Date('2024-01-01') };
      mockStudyPlansService.findById.mockResolvedValue(mockPlan);

      const result = await controller.findById(mockRequest as any, 'planId123');
      expect(result).toEqual(mockPlan);
      expect(mockStudyPlansService.findById).toHaveBeenCalledWith(
        mockRequest.user.id,
        'planId123',
      );
    });

    it('should throw Unauthorized exception if no user id', async () => {
      const requestWithoutUser = { user: {} };

      try {
        await controller.findById(requestWithoutUser as any, 'planId123');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Unauthorized');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('update', () => {
    it('should update a study plan successfully', async () => {
      const updateStudyPlanDto = { name: 'Updated Plan' };
      mockStudyPlansService.update.mockResolvedValue({
        ...updateStudyPlanDto,
        id: 'planId123',
        userId: mockRequest.user.id,
      });

      const result = await controller.update(
        mockRequest as any,
        'planId123',
        updateStudyPlanDto,
      );
      expect(result).toEqual({
        name: 'Updated Plan',
        id: 'planId123',
        userId: mockRequest.user.id,
      });
      expect(mockStudyPlansService.update).toHaveBeenCalledWith(
        mockRequest.user.id,
        'planId123',
        updateStudyPlanDto,
      );
    });

    it('should throw Unauthorized exception if no user id', async () => {
      const requestWithoutUser = { user: {} };
      const updateStudyPlanDto = { name: 'Updated Plan' };

      try {
        await controller.update(
          requestWithoutUser as any,
          'planId123',
          updateStudyPlanDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Unauthorized');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('remove', () => {
    it('should remove a study plan successfully', async () => {
      mockStudyPlansService.remove.mockResolvedValue(undefined);

      await controller.remove(mockRequest as any, 'planId123');
      expect(mockStudyPlansService.remove).toHaveBeenCalledWith(
        mockRequest.user.id,
        'planId123',
      );
    });

    it('should throw Unauthorized exception if no user id', async () => {
      const requestWithoutUser = { user: {} };

      try {
        await controller.remove(requestWithoutUser as any, 'planId123');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Unauthorized');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });
});
