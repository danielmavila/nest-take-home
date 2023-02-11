import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }
}
