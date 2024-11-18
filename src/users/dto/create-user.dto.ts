import { User } from '../entities/user.entity';
import {
  IsEmail,
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
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: `The password will be used to login.`,
    type: 'string',
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
  })
  @IsString()
  name: string;
}
