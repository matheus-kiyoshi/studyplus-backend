import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create subject' })
  create(
    @Request() req: AuthRequest,
    @Body() createSubjectDto: CreateSubjectDto,
  ) {
    return this.subjectsService.create(req.user.id, createSubjectDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user subjects' })
  findAll(@Request() req: AuthRequest) {
    return this.subjectsService.findAll(req.user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get subject by id' })
  findById(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.subjectsService.findById(req.user.id, id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update subject' })
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(req.user.id, id, updateSubjectDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete subject' })
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.subjectsService.remove(req.user.id, id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id/study-plans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get study plans for subject' })
  getStudyPlansForSubject(
    @Request() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.subjectsService.getStudyPlansForSubject(req.user.id, id);
  }
}
