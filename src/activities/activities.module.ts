import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsService } from 'src/reviews/reviews.service';

@Module({
  imports: [PrismaModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ReviewsService],
})
export class ActivitiesModule {}
