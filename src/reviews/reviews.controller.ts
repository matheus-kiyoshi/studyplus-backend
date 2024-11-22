import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user reviews' })
  findAll(@Request() req: AuthRequest) {
    return this.reviewsService.findAll(req.user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get review by id' })
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.reviewsService.findOne(req.user.id, id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update review' })
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(req.user.id, id, updateReviewDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove review by id' })
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.reviewsService.remove(req.user.id, id);
  }
}
