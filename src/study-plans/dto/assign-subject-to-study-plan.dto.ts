import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class AssignSubjectToStudyPlanDto {
  @ApiProperty({
    example: 'HIGH',
    description: `The priority level of the subject.`,
    required: false,
    enum: $Enums.PriorityLevel,
  })
  @IsOptional()
  @IsEnum($Enums.PriorityLevel)
  priority?: $Enums.PriorityLevel;

  @ApiProperty({
    example: 100,
    description: `The total number of hours dedicated to the subject.`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hoursTarget: number;
}
