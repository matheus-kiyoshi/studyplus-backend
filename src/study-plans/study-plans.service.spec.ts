/*import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlansService } from './study-plans.service';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';

jest.mock('../prisma/prisma.service');

const now = new Date();

describe('StudyPlansService', () => {
  let service: StudyPlansService;
  let prismaService: PrismaService;

  const mockUserId = 'user123';
  const mockUser = {
    id: mockUserId,
    name: 'Test User',
    email: 'user@test.com',
  };

  const createStudyPlanDto = {
    name: 'Plan 1',
    goal: 'my goal',
    startDate: new Date('2024-08-08'),
    endDate: new Date('2024-12-31'),
    hoursGoal: 100,
  };

  const mockStudyPlan = {
    id: '1',
    userId: mockUserId,
    name: createStudyPlanDto.name,
    startDate: createStudyPlanDto.startDate,
    endDate: createStudyPlanDto.endDate,
    goal: createStudyPlanDto.goal,
    hoursGoal: createStudyPlanDto.hoursGoal || 0,
    hoursSpent: 0,
    status: $Enums.StudyPlanStatus.ACTIVE,
    createdAt: now,
    User: { id: mockUserId },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudyPlansService,
        {
          provide: PrismaService,
          useValue: {
            studyPlans: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            user: {
              findUnique: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StudyPlansService>(StudyPlansService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new study plan', async () => {
      prismaService.studyPlans.create = jest
        .fn()
        .mockResolvedValue(mockStudyPlan);

      const result = await service.create(mockUserId, createStudyPlanDto);

      expect(result).toEqual({
        ...mockStudyPlan,
        id: undefined,
        userId: undefined,
        User: undefined,
      });
      expect(prismaService.studyPlans.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          name: createStudyPlanDto.name,
          goal: createStudyPlanDto.goal,
          startDate: createStudyPlanDto.startDate,
          endDate: createStudyPlanDto.endDate,
          hoursGoal: createStudyPlanDto.hoursGoal,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all study plans for a user', async () => {
      prismaService.studyPlans.findMany = jest
        .fn()
        .mockResolvedValue([mockStudyPlan]);

      const result = await service.findAll(mockUserId);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { User, ...mockStudyPlanWithoutUser } = mockStudyPlan[0];
      expect(result).toEqual([mockStudyPlanWithoutUser]);
      expect(prismaService.studyPlans.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });
  });

  describe('findById', () => {
    it('should return a study plan by id', async () => {
      prismaService.studyPlans.findUnique = jest
        .fn()
        .mockResolvedValue(mockStudyPlan);

      const result = await service.findById(mockUserId, '1');

      expect(result).toEqual({
        ...mockStudyPlan,
        User: undefined,
      });
      expect(prismaService.studyPlans.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { User: true },
      });
    });
  });

  describe('update', () => {
    it('should update a study plan', async () => {
      const updateDto = { name: 'Updated Plan' };
      const updatedStudyPlan = { ...mockStudyPlan, ...updateDto };

      prismaService.studyPlans.update = jest
        .fn()
        .mockResolvedValue(updatedStudyPlan);

      const result = await service.update(mockUserId, '1', updateDto);

      expect(result).toEqual({
        ...updatedStudyPlan,
        id: undefined,
        userId: undefined,
        User: undefined,
      });
      expect(prismaService.studyPlans.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a study plan', async () => {
      prismaService.studyPlans.delete = jest
        .fn()
        .mockResolvedValue(mockStudyPlan);

      const result = await service.remove(mockUserId, '1');

      expect(result).toEqual(mockStudyPlan);
      expect(prismaService.studyPlans.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
*/
