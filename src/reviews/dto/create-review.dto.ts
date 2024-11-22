import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: $Enums.ReviewStatus.SKIPPED,
    description: 'The status of the review.',
    required: false,
    enum: $Enums.ReviewStatus,
  })
  @IsOptional()
  @IsEnum($Enums.ReviewStatus)
  status?: $Enums.ReviewStatus;
}
