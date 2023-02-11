import { Controller, Post, Body, UsePipes, ValidationPipe} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
