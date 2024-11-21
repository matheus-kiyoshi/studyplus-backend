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
} from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { CreateStudyPlanDto } from './dto/create-study-plan.dto';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../auth/models/AuthRequest';
import { AssignSubjectToStudyPlanDto } from './dto/assign-subject-to-study-plan.dto';

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
    return this.studyPlansService.create(req.user.id, createStudyPlanDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user study plans' })
  findAll(@Request() req: AuthRequest) {
    return this.studyPlansService.findAll(req.user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get study plan by id' })
  findById(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.studyPlansService.findById(req.user.id, id);
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
    return this.studyPlansService.update(req.user.id, id, updateStudyPlanDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete study plan' })
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.studyPlansService.remove(req.user.id, id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/subjects/:subjectId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign subject to study plan' })
  assignSubjectToStudyPlan(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Param('subjectId') subjectId: string,
    @Body() assignSubjectToStudyPlanDto: AssignSubjectToStudyPlanDto,
  ) {
    return this.studyPlansService.assignSubjectToStudyPlan(
      req.user.id,
      id,
      subjectId,
      assignSubjectToStudyPlanDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/subjects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get study plan subjects' })
  getSubjectsByStudyPlan(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.studyPlansService.getSubjectsByStudyPlan(req.user.id, id);
  }
}
