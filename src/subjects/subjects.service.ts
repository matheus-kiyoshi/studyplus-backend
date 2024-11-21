import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  create(userId: string, createSubjectDto: CreateSubjectDto) {
    return 'This action adds a new subject';
  }

  findAll(userId: string) {
    return `This action returns all subjects`;
  }

  findById(userId: string, id: string) {
    return `This action returns a #${id} subject`;
  }

  update(userId: string, id: string, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(userId: string, id: string) {
    return `This action removes a #${id} subject`;
  }
}
