import { $Enums, Prisma } from '@prisma/client';

export class StudyPlan implements Prisma.StudyPlansUncheckedCreateInput {
  id?: string;
  userId: string;
  name: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  goal: string;
  hoursGoal?: number;
  hoursSpent?: number;
  status?: $Enums.StudyPlanStatus;
  createdAt?: Date | string;
  PlanSubjects?: Prisma.PlanSubjectsUncheckedCreateNestedManyWithoutStudyPlansInput;
}
