import { Injectable } from '@nestjs/common';
import { CreateStudyPlanDto } from './dto/create-study-plan.dto';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';

@Injectable()
export class StudyPlansService {
  create(userId: string, createStudyPlanDto: CreateStudyPlanDto) {
    return 'This action adds a new studyPlan';
  }

  findAll(userId: string) {
    return `This action returns all studyPlans`;
  }

  findById(userId: string, id: number) {
    return `This action returns a #${id} studyPlan`;
  }

  update(userId: string, id: number, updateStudyPlanDto: UpdateStudyPlanDto) {
    return `This action updates a #${id} studyPlan`;
  }

  remove(userId: string, id: number) {
    return `This action removes a #${id} studyPlan`;
  }
}
