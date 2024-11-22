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
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@ApiTags('Activities')
@Controller('subjects/:subjectId/topics/:topicId/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create activity' })
  create(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('topicId') topicId: string,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.activitiesService.create(
      req.user.id,
      subjectId,
      topicId,
      createActivityDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all subject-topic activities' })
  findAll(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('topicId') topicId: string,
  ) {
    return this.activitiesService.findAll(req.user.id, subjectId, topicId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get activity of a topic by id' })
  findById(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('topicId') topicId: string,
    @Param('id') id: string,
  ) {
    return this.activitiesService.findById(req.user.id, subjectId, topicId, id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update activity' })
  update(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('topicId') topicId: string,
    @Param('id') id: string,
    @Body() UpdateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(
      req.user.id,
      subjectId,
      topicId,
      id,
      UpdateActivityDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete activity' })
  remove(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('topicId') topicId: string,
    @Param('id') id: string,
  ) {
    return this.activitiesService.remove(req.user.id, subjectId, topicId, id);
  }
}
