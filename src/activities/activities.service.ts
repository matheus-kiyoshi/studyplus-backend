import { HttpException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    subjectId: string,
    topicId: string,
    createActivityDto: CreateActivityDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const topic = await this.prisma.topics.findUnique({
      where: { id: topicId },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    const data: Prisma.ActivitiesCreateInput = {
      ...createActivityDto,
      startDate: new Date(createActivityDto.startDate),
      User: { connect: { id: userId } },
      Subjects: { connect: { id: subjectId } },
      Topics: { connect: { id: topicId } },
    };

    const createdActivity = await this.prisma.activities.create({ data });
    if (!createdActivity) {
      throw new HttpException('Error creating activity', 500);
    }

    return {
      ...createdActivity,
      userId: undefined,
      User: undefined,
    };
  }

  async findAll(userId: string, subjectId: string, topicId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const topic = await this.prisma.topics.findUnique({
      where: { id: topicId },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    const activities = await this.prisma.activities.findMany({
      where: { subjectId },
      include: { Reviews: true, Subjects: false, Topics: false, User: false },
    });
    if (!activities) {
      throw new HttpException('Activities not found', 404);
    }

    return activities;
  }

  async findById(
    userId: string,
    subjectId: string,
    topicId: string,
    id: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const topic = await this.prisma.topics.findUnique({
      where: { id: topicId },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    const activity = await this.prisma.activities.findUnique({
      where: { id },
      include: { Reviews: true, Subjects: false, Topics: false, User: false },
    });
    if (!activity) {
      throw new HttpException('Activity not found', 404);
    }

    return activity;
  }

  async update(
    userId: string,
    subjectId: string,
    topicId: string,
    id: string,
    updateActivityDto: UpdateActivityDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const topic = await this.prisma.topics.findUnique({
      where: { id: topicId },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    const activity = await this.prisma.activities.findUnique({
      where: { id, subjectId },
    });
    if (!activity) {
      throw new HttpException('Activity not found', 404);
    }

    const data: Prisma.ActivitiesUpdateInput = {
      ...updateActivityDto,
    };

    const updatedActivity = await this.prisma.activities.update({
      where: { id },
      data,
    });
    if (!updatedActivity) {
      throw new HttpException('Error updating activity', 500);
    }

    return {
      ...updatedActivity,
      userId: undefined,
      User: undefined,
    };
  }

  async remove(userId: string, subjectId: string, topicId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const topic = await this.prisma.topics.findUnique({
      where: { id: topicId },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    const activity = await this.prisma.activities.findUnique({
      where: { id, subjectId },
    });
    if (!activity) {
      throw new HttpException('Activity not found', 404);
    }

    const deletedActivity = await this.prisma.activities.delete({
      where: { id },
    });
    if (!deletedActivity) {
      throw new HttpException('Error deleting activity', 500);
    }

    return;
  }
}
