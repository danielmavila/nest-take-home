import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    console.log(username, password);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // const hashedPassword = await bcrypt.hash(password, 10);

    // TODO store user

    const payload = { username };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { accessToken };
  }
}
