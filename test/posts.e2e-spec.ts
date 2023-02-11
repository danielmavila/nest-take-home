import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';

import { AppModule } from './../src/app.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns an error message if the title is missing', () => {
    const jwtToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ text: 'My post text' })
      .expect(400);
  });

  it('returns an error message if the text is missing', () => {
    const jwtToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'My post title' })
      .expect(400);
  });

  it('returns a forbidden error if the user does not provide a valid JWT', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'My post title', text: 'My post text' })
      .expect(401);
  });
});
