import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    example: 'Mathematics',
    description: `The name of the subject.`,
    required: true,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(35)
  name: string;

  @ApiProperty({
    example: 'Mathematics is the study of numbers, shapes, and patterns.',
    description: `The description of the subject.`,
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 100000,
    description: `The total number of seconds dedicated to the subject.`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;

  @ApiProperty({
    example: '#FF0000',
    description: `The color of the subject.`,
    required: true,
  })
  @IsString()
  color: string;
}
