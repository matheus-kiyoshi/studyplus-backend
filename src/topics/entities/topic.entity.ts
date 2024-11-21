import { Prisma } from '@prisma/client';

export class Topic implements Prisma.TopicsUncheckedCreateInput {
  id?: string;
  subjectId: string;
  name: string;
  description: string;
  timeSpent?: number;
  createdAt?: string | Date;
  Activities?: Prisma.ActivitiesUncheckedCreateNestedManyWithoutTopicsInput;
}
