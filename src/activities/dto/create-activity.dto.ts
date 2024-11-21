import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({
    example: '2021-09-07T12',
    description: `The start date and time of the activity.`,
    required: true,
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: 10000,
    description: `The total number of seconds dedicated to the activity.`,
    required: true,
  })
  @IsNumber()
  studyTime: number;

  @ApiProperty({
    example: 1,
    description: `The number of questions done during the activity.`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  questionsDone?: number;

  @ApiProperty({
    example: 1,
    description: `The number of questions correct during the activity.`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  questionsCorrect?: number;

  @ApiProperty({
    example: '2021-09-07T12',
    description: `The scheduled review date of the activity.`,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledReviewDate?: Date;
}
