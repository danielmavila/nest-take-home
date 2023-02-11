import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { CreatePostDto } from '../dto/create-post.dto';

@Controller('posts')
@UseGuards(AuthGuard())
export class PostsController {
  @Post()
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    if (!createPostDto.title) {
      throw new BadRequestException('Title is required');
    }

    if (!createPostDto.text) {
      throw new BadRequestException('Text is required');
    }
  }
}
