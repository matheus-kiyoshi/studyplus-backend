import { Prisma } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  name: string;
  email: string;
  password?: string | null;
  token?: string | null;
  goal?: string | null;
  dailyTime?: number | null;
  totalHours?: number;
  googleAccountLinked: boolean;
  googleEmail?: string;
  createdAt?: Date | string;
  StudyPlans?: Prisma.StudyPlansUncheckedCreateNestedManyWithoutUserInput;
  Subjects?: Prisma.SubjectsUncheckedCreateNestedManyWithoutUserInput;
  Activities?: Prisma.ActivitiesUncheckedCreateNestedManyWithoutUserInput;
  Reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
}
