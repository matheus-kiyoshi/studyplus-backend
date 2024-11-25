import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleLoginRequestBody {
  @ApiProperty({
    example: 'jwt token',
    description: 'Google ID Token',
    required: true,
  })
  @IsString()
  idToken: string;
}
