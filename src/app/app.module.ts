import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { PostsController } from '../posts/posts.controller';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest_takehome',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
  ],
  controllers: [PostsController, AuthController],
  providers: [JwtStrategy, AuthService, UserService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
