import { Prisma } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  name: string;
  email: string;
  password: string;
  token?: string | null;
  goal?: string | null;
  dailyTime?: number | null;
  totalHours?: number;
  createdAt?: Date | string;
  accessToken?: string;
  StudyPlans?: Prisma.StudyPlansUncheckedCreateNestedManyWithoutUserInput;
  Reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
}
