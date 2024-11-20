import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudyPlanDto {
  @ApiProperty({
    example: 'Study Plan 1',
    description: `The name of the study plan.`,
    required: true,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(35)
  name: string;

  @ApiProperty({
    example: '2024-08-08',
    description: `The start date of the study plan.`,
    required: true,
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: '2024-12-31',
    description: `The end date of the study plan.`,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date | null;

  @ApiProperty({
    example: 'Learn programming in 6 months',
    description: `The main goal of the study plan.`,
    required: true,
  })
  @IsString()
  goal: string;

  @ApiProperty({
    example: 100,
    description: `The total number of hours dedicated to the study plan.`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hoursGoal?: number;

  @ApiProperty({
    example: 0,
    description: `The total number of hours already spent on the study plan.`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hoursSpent?: number;
}
