import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getNextReviewDate } from 'src/lib/utils/getNextReviewDate';
import { $Enums, Prisma } from '@prisma/client';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, activityId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return new HttpException('User not found', 404);
    }

    const activity = await this.prisma.activities.findUnique({
      where: { id: activityId },
    });
    if (!activity) {
      return new HttpException('Activity was not created', 404);
    }

    const review = await this.prisma.reviews.findFirst({
      where: { userId, activityId },
    });
    if (review) {
      return new HttpException('Review already exists', 400);
    }

    const data: Prisma.ReviewsCreateInput = {
      timesReviewed: 0,
      lastReviewedAt: new Date(),
      nextReviewAt: getNextReviewDate(0, new Date()),
      status: $Enums.ReviewStatus.PENDING,
      Activities: { connect: { id: activityId } },
      User: { connect: { id: userId } },
    };

    const createdReview = await this.prisma.reviews.create({ data });
    if (!createdReview) {
      return new HttpException('Error creating review', 500);
    }

    return {
      ...createdReview,
      userId: undefined,
      User: undefined,
    };
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return new HttpException('User not found', 404);
    }

    const reviews = await this.prisma.reviews.findMany({
      where: { userId },
      include: { User: false },
    });
    if (!reviews) {
      return new HttpException('Reviews not found', 404);
    }

    return reviews;
  }

  async findOne(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return new HttpException('User not found', 404);
    }

    const review = await this.prisma.reviews.findUnique({
      where: { id },
      include: { User: false },
    });
    if (!review) {
      return new HttpException('Review not found', 404);
    }

    return review;
  }

  async update(userId: string, id: string, updateReviewDto: UpdateReviewDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return new HttpException('User not found', 404);
    }

    const review = await this.prisma.reviews.findUnique({
      where: { id },
    });
    if (!review) {
      return new HttpException('Review not found', 404);
    }

    if (!updateReviewDto.status) {
      const updatedTimesReviewed = review.timesReviewed + 1;

      const newNextReviewAt = getNextReviewDate(
        updatedTimesReviewed,
        review.lastReviewedAt,
      );

      const newStatus =
        updatedTimesReviewed > 4
          ? $Enums.ReviewStatus.COMPLETED
          : review.status;

      const updatedReview = await this.prisma.reviews.update({
        where: { id, userId },
        data: {
          timesReviewed: updatedTimesReviewed,
          lastReviewedAt: new Date(),
          nextReviewAt: newNextReviewAt,
          status: newStatus,
        },
      });
      if (!updatedReview) {
        return new HttpException('Error updating review', 500);
      }

      return updatedReview;
    } else {
      const updatedReview = await this.prisma.reviews.update({
        where: { id, userId },
        data: updateReviewDto,
      });
      if (!updatedReview) {
        return new HttpException('Error updating review', 500);
      }

      return updatedReview;
    }
  }

  async remove(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return new HttpException('User not found', 404);
    }

    const review = await this.prisma.reviews.findUnique({
      where: { id },
    });
    if (!review) {
      return new HttpException('Review not found', 404);
    }

    const deletedReview = await this.prisma.reviews.delete({
      where: { id },
    });
    if (!deletedReview) {
      return new HttpException('Error deleting review', 500);
    }

    return;
  }
}
