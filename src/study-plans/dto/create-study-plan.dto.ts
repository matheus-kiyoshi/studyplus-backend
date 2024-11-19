import {
  IsDateString,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StudyPlan } from '../entities/study-plan.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudyPlanDto extends StudyPlan {
  @ApiProperty({
    example: 'Study Plan 1',
    description: `The name will be used to identify the study plan in the application.`,
    type: 'string',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(35)
  name: string;

  @ApiProperty({
    example: '2022-01-01',
    description: `The start date will be used to identify the study plan's start date in the application.`,
    type: 'string',
  })
  @IsDateString()
  startDate: Date | string;

  @ApiProperty({
    example: '2026-01-01',
    description: `The end date will be used to identify the study plan's end date in the application.`,
    type: 'string',
  })
  @IsDateString()
  endDate?: Date | string | null;

  @ApiProperty({
    example: 'I want to learn how to code',
    description: `The goal will be used to identify the study plan's main objective in the application.`,
    type: 'string',
  })
  @IsString()
  goal: string;

  @ApiProperty({
    example: 800,
    description: `The hours goal will be used to identify the study plan's main objective in the application.`,
    type: 'number',
  })
  @IsNumber()
  hoursGoal?: number;
}
