import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends User {
  @ApiProperty({
    example: 'user@email.com',
    description: `The email will be used to identify the user in the application and will be used to login.`,
    type: 'string',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: `The password will be used to login.`,
    type: 'string',
    required: true,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({
    example: 'Harry Edward',
    description: `The name will be used to identify the user in the application.`,
    type: 'string',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'I want to learn how to code',
    description: `The goal will be used to identify the user's main objective in the application.`,
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiProperty({
    example: 4,
    description: `The daily time will be used to identify the available user's daily study time (in hours) in the application.`,
    type: 'number',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  dailyTime?: number | null;
}
