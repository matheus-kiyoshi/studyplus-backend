import { Prisma } from '@prisma/client';

export class Activity implements Prisma.ActivitiesUncheckedCreateInput {
  id?: string;
  userId: string;
  subjectId: string;
  topicId: string;
  startDate: string | Date;
  studyTime: number;
  questionsDone?: number;
  questionsCorrect?: number;
  scheduledReviewDate?: string | Date;
  createdAt?: string | Date;
  Reviews?: Prisma.ReviewsUncheckedCreateNestedOneWithoutActivitiesInput;
}
