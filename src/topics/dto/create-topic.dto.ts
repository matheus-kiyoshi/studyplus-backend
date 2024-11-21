import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({
    example: 'Trigonometry',
    description: `The name of the topic.`,
    required: true,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(35)
  name: string;

  @ApiProperty({
    example:
      'Trigonometry is a branch of mathematics that studies relationships between the sides and angles of triangles.',
    description: `The description of the topic.`,
    required: true,
  })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    example: 100000,
    description: `The total number of seconds dedicated to the topic.`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;
}
