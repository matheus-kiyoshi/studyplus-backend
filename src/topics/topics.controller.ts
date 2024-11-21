import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Request,
  HttpException,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@ApiTags('Topics')
@Controller('subjects/:subjectId/topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create topic' })
  create(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    if (req.user.id) {
      return this.topicsService.create(req.user.id, subjectId, createTopicDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all subject topics' })
  findAll(@Request() req: AuthRequest, @Param('subjectId') subjectId: string) {
    if (req.user.id) {
      return this.topicsService.findAll(req.user.id, subjectId);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get topic of a subject by id' })
  findById(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('id') id: string,
  ) {
    if (req.user.id) {
      return this.topicsService.findById(req.user.id, subjectId, id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update topic' })
  update(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('id') id: string,
    @Body() UpdateTopicDto: UpdateTopicDto,
  ) {
    if (req.user.id) {
      return this.topicsService.update(
        req.user.id,
        subjectId,
        id,
        UpdateTopicDto,
      );
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete topic' })
  remove(
    @Request() req: AuthRequest,
    @Param('subjectId') subjectId: string,
    @Param('id') id: string,
  ) {
    if (req.user.id) {
      return this.topicsService.remove(req.user.id, subjectId, id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
