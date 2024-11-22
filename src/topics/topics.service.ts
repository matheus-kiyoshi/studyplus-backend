import { HttpException, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    subjectId: string,
    createTopicDto: CreateTopicDto,
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

    const topic = await this.prisma.topics.findFirst({
      where: { subjectId, name: createTopicDto.name },
    });
    if (topic) {
      throw new HttpException('Topic already exists', 400);
    }

    const data: Prisma.TopicsCreateInput = {
      ...createTopicDto,
      Subjects: { connect: { id: subjectId } },
    };

    const createdTopic = await this.prisma.topics.create({ data });
    if (!createdTopic) {
      throw new HttpException('Error creating topic', 500);
    }

    return {
      ...createdTopic,
      userId: undefined,
      User: undefined,
    };
  }

  async findAll(userId: string, subjectId: string) {
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

    const topics = await this.prisma.topics.findMany({
      where: { subjectId },
      include: { Activities: true, Subjects: false },
    });
    if (!topics) {
      throw new HttpException('Topics not found', 404);
    }

    return topics;
  }

  async findById(userId: string, subjectId: string, id: string) {
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
      where: { id },
      include: { Activities: true, Subjects: false },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    return topic;
  }

  async update(
    userId: string,
    subjectId: string,
    id: string,
    updateTopicDto: UpdateTopicDto,
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
      where: { id, subjectId },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    const data: Prisma.TopicsUpdateInput = {
      ...updateTopicDto,
    };

    const updatedTopic = await this.prisma.topics.update({
      where: { id },
      data,
    });
    if (!updatedTopic) {
      throw new HttpException('Error updating topic', 500);
    }

    return {
      ...updatedTopic,
      userId: undefined,
      User: undefined,
    };
  }

  async remove(userId: string, subjectId: string, id: string) {
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
      where: { id, subjectId },
    });
    if (!topic) {
      throw new HttpException('Topic not found', 404);
    }

    const deletedTopic = await this.prisma.topics.delete({
      where: { id },
    });
    if (!deletedTopic) {
      throw new HttpException('Error deleting topic', 500);
    }

    return;
  }
}
