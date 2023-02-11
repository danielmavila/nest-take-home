import { Controller, Post, Body } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    if (!createPostDto.title) {
    throw new BadRequestException('Title is required');
    }

    if (!createPostDto.text) {
    throw new BadRequestException('Text is required');
    }
  }
}