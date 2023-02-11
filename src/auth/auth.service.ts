import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    let userEntity = this.toEntity(registerDto, hashedPassword);
    let user: User;

    try {
      user = await this.userService.create(userEntity);
    } catch {
      throw new BadRequestException();
    }

    const payload = { username, id: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  private toEntity(dto: RegisterDto, hashedPassword: string): User {
    const user = new User();
    user.username = dto.username;
    user.email = dto.email;
    user.password = hashedPassword;
    return user;
  }
}
