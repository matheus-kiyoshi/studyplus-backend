import { Module } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { StudyPlansController } from './study-plans.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudyPlansController],
  providers: [StudyPlansService],
})
export class StudyPlansModule {}
