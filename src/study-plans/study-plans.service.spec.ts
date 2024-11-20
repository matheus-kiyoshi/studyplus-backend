import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlansService } from './study-plans.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/prisma.service');

describe('StudyPlansService', () => {
  let service: StudyPlansService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudyPlansService,
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

    service = module.get<StudyPlansService>(StudyPlansService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
