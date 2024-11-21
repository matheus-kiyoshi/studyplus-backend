import {
  Request,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { AuthRequest } from '../auth/models/AuthRequest';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { RequestPasswordUserDto } from './dto/request-password-reset.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @IsPublic()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by id' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user informations' })
  update(@Request() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    if (req.user.id) {
      return this.usersService.update(req.user.id, updateUserDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  remove(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.usersService.remove(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Patch('password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user password' })
  updatePassword(
    @Request() req: AuthRequest,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    if (req.user.id) {
      return this.usersService.updatePassword(
        req.user.id,
        updateUserPasswordDto,
      );
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Patch('password/requestreset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset link via email' })
  requestPasswordRest(@Body() requestPasswordUserDto: RequestPasswordUserDto) {
    return this.usersService.requestPasswordReset(requestPasswordUserDto.email);
  }

  @IsPublic()
  @Patch('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  resetPassword(@Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.usersService.resetPassword(resetPasswordUserDto);
  }

  @IsPublic()
  @Get('search/:searchArg')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search users by name or email' })
  findBySearchArg(@Param('searchArg') searchArg: string) {
    return this.usersService.findBySearchArg(searchArg);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('/my/study-plans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user study plans' })
  findUserStudyPlans(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.usersService.findUserStudyPlans(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get('/my/subjects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user subjects' })
  findUserSubjects(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.usersService.findUserSubjects(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
