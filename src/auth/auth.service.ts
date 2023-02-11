import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private users = [];

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // const hashedPassword = await bcrypt.hash(password, 10);

    // TODO store user
    let user = await this.findByUsername(username);
    if (user !== null) {
      throw new BadRequestException();
    }

    user = await this.findByEmail(email);
    if (user !== null) {
      throw new BadRequestException();
    }

    this.users.push(registerDto);

    const payload = { username };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async findByUsername(username: string): Promise<any> {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      return user;
    }
    return null;
  }

  async findByEmail(email: string): Promise<any> {
    const user = this.users.find((u) => u.email === email);
    if (user) {
      return user;
    }
    return null;
  }
}
