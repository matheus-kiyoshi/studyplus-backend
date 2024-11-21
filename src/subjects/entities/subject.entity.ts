import { Prisma } from '@prisma/client';

export class Subject implements Prisma.SubjectsUncheckedCreateInput {
  id?: string;
  userId: string;
  name: string;
  description: string;
  timeSpent?: number;
  color: string;
  createdAt?: string | Date;
  Topics?: Prisma.TopicsUncheckedCreateNestedManyWithoutSubjectsInput;
  Activities?: Prisma.ActivitiesUncheckedCreateNestedManyWithoutSubjectsInput;
  PlanSubjects?: Prisma.PlanSubjectsUncheckedCreateNestedManyWithoutSubjectsInput;
}
