import { $Enums, Prisma } from '@prisma/client';

export class Review implements Prisma.ReviewsUncheckedCreateInput {
  id?: string;
  userId: string;
  activityId: string;
  timesReviewed?: number;
  lastReviewedAt: string | Date;
  nextReviewAt: string | Date;
  status?: $Enums.ReviewStatus;
  createdAt?: string | Date;
}
