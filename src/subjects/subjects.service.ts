import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createSubjectDto: CreateSubjectDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const data: Prisma.SubjectsCreateInput = {
      ...createSubjectDto,
      User: { connect: { id: userId } },
    };

    const createdSubject = await this.prisma.subjects.create({ data });
    if (!createdSubject) {
      throw new HttpException('Error creating subject', 500);
    }

    return {
      ...createdSubject,
      userId: undefined,
      User: undefined,
    };
  }

  async findAll(userId: string) {
    const subjects = await this.prisma.subjects.findMany({
      where: { userId },
      include: { User: false },
    });
    if (!subjects) {
      throw new HttpException('Subjects not found', 404);
    }

    return subjects;
  }

  async findById(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id, userId },
      include: { User: false },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    return subject;
  }

  async update(userId: string, id: string, updateSubjectDto: UpdateSubjectDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id, userId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const data: Prisma.SubjectsUpdateInput = {
      ...updateSubjectDto,
    };

    const updatedSubject = await this.prisma.subjects.update({
      where: { id },
      data,
    });
    if (!updatedSubject) {
      throw new HttpException('Error updating subject', 500);
    }

    return {
      ...updatedSubject,
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

    const subject = await this.prisma.subjects.findUnique({
      where: { id, userId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const deletedSubject = await this.prisma.subjects.delete({
      where: { id },
    });
    if (!deletedSubject) {
      throw new HttpException('Error deleting subject', 500);
    }

    return;
  }

  async getStudyPlansForSubject(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const subject = await this.prisma.subjects.findUnique({
      where: { id, userId },
    });
    if (!subject) {
      throw new HttpException('Subject not found', 404);
    }

    const studyPlans = await this.prisma.studyPlans.findMany({
      where: { PlanSubjects: { some: { subjectId: id } } },
    });
    if (!studyPlans) {
      throw new HttpException('Study plans not found', 404);
    }

    return studyPlans;
  }
}
