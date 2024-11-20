import { HttpException, Injectable } from '@nestjs/common';
import { CreateStudyPlanDto } from './dto/create-study-plan.dto';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudyPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createStudyPlanDto: CreateStudyPlanDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const data: Prisma.StudyPlansCreateInput = {
      ...createStudyPlanDto,
      startDate: new Date(createStudyPlanDto.startDate),
      endDate: createStudyPlanDto.endDate
        ? new Date(createStudyPlanDto.endDate)
        : null,
      User: { connect: { id: userId } },
    };

    const createdStudyPlan = await this.prisma.studyPlans.create({ data });
    if (!createdStudyPlan) {
      throw new HttpException('Error creating study plan', 500);
    }

    return {
      ...createdStudyPlan,
      id: undefined,
      userId: undefined,
      User: undefined,
    };
  }

  async findAll(userId: string) {
    const studyPlans = await this.prisma.studyPlans.findMany({
      where: { userId },
      include: { User: false },
    });
    if (!studyPlans) {
      throw new HttpException('Study plans not found', 404);
    }

    return studyPlans;
  }

  async findById(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const studyPlan = await this.prisma.studyPlans.findUnique({
      where: { id, userId },
      include: { User: false },
    });
    if (!studyPlan) {
      throw new HttpException('Study plan not found', 404);
    }

    return studyPlan;
  }

  async update(
    userId: string,
    id: string,
    updateStudyPlanDto: UpdateStudyPlanDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const studyPlan = await this.prisma.studyPlans.findUnique({
      where: { id, userId },
    });
    if (!studyPlan) {
      throw new HttpException('Study plan not found', 404);
    }

    const data: Prisma.StudyPlansUpdateInput = {
      ...updateStudyPlanDto,
    };

    const updatedStudyPlan = await this.prisma.studyPlans.update({
      where: { id },
      data,
    });
    if (!updatedStudyPlan) {
      throw new HttpException('Error updating study plan', 500);
    }

    return {
      ...updatedStudyPlan,
      id: undefined,
      userId: undefined,
      User: undefined,
    };
  }

  async remove(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const studyPlan = await this.prisma.studyPlans.findUnique({
      where: { id, userId },
    });
    if (!studyPlan) {
      throw new HttpException('Study plan not found', 404);
    }

    const deletedStudyPlan = await this.prisma.studyPlans.delete({
      where: { id },
    });
    if (!deletedStudyPlan) {
      throw new HttpException('Error deleting study plan', 500);
    }

    return;
  }
}
