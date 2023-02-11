import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';

import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
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
        jwt.verify(res.body.accessToken, process.env.JWT_SECRET, (err, decoded) => {
          expect(err).toBeNull();
          expect(decoded.username).toEqual(registerDto.username);
        });
      });
  });

  it('/auth/register (POST) with missing username should return 400 Bad Request', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(400);
  });
  
  it('/auth/register (POST) with missing email should return 400 Bad Request', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'test', password: 'password' })
      .expect(400);
  });
  
  it('/auth/register (POST) with missing password should return 400 Bad Request', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'test', email: 'test@example.com' })
      .expect(400);
  });
  
  it('/auth/register (POST) with password less than 8 characters should return 400 Bad Request', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'test', email: 'test@example.com', password: 'pass' })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
