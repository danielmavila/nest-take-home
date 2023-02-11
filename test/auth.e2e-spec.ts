import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';

import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  describe('/auth/register (POST)', () => {
    let app: INestApplication;
    let entityManager: EntityManager;
    let authService: AuthService;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      entityManager = app.get<EntityManager>(EntityManager);
      await entityManager.query(`TRUNCATE TABLE user`);
      authService = app.get<AuthService>(AuthService);
      await app.init();
    });

    it('should return a JWT token with valid request data', () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          jwt.verify(
            res.body.accessToken,
            process.env.JWT_SECRET,
            (err, decoded) => {
              expect(err).toBeNull();
              expect(decoded.username).toEqual(registerDto.username);
            },
          );
        });
    });

    it('should return an error if the username is not unique', () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser1',
        password: 'password',
      };

      authService.register({
        email: 'test1@example.com',
        username: 'testuser1',
        password: 'password',
      });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should return an error if the email is not unique', () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };

      authService.register({
        email: 'test@example.com',
        username: 'testuser1',
        password: 'password',
      });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should return 400 Bad Request when a username is not provided', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(400);
    });

    it('should return 400 Bad Request when an email is not provided', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'test', password: 'password' })
        .expect(400);
    });

    it('should return 400 Bad Request when a password is not provided', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'test', email: 'test@example.com' })
        .expect(400);
    });

    it('should return 400 Bad Request if the password provided is less than 8 characters', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'test', email: 'test@example.com', password: 'pass' })
        .expect(400);
    });

    afterEach(async () => {
      await entityManager.query(`TRUNCATE TABLE user`);
      await app.close();
    });
  });
});
