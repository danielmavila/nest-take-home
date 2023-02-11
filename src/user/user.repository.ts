import { Repository } from 'typeorm';
import { User } from './user.entity';

export class UserRepository extends Repository<User> {
  async findOneByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } });
  }
  
  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }
}