import { Controller, Post, Body, UsePipes, UseGuards, ValidationPipe, Req } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { CreatePostDto } from '../dto/create-post.dto';

@Controller('posts')
@UseGuards(AuthGuard())
export class PostsController {
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
  }
}
