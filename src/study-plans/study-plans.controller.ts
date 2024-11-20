import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  HttpException,
} from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { CreateStudyPlanDto } from './dto/create-study-plan.dto';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../auth/models/AuthRequest';

@ApiTags('Study Plans')
@Controller('study-plans')
export class StudyPlansController {
  constructor(private readonly studyPlansService: StudyPlansService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create study plan' })
  create(
    @Request() req: AuthRequest,
    @Body() createStudyPlanDto: CreateStudyPlanDto,
  ) {
    if (req.user.id) {
      return this.studyPlansService.create(req.user.id, createStudyPlanDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user study plans' })
  findAll(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.studyPlansService.findAll(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get study plan by id' })
  findById(@Request() req: AuthRequest, @Param('id') id: string) {
    if (req.user.id) {
      return this.studyPlansService.findById(req.user.id, id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update study plan' })
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateStudyPlanDto: UpdateStudyPlanDto,
  ) {
    if (req.user.id) {
      return this.studyPlansService.update(req.user.id, id, updateStudyPlanDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete study plan' })
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    if (req.user.id) {
      return this.studyPlansService.remove(req.user.id, id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
