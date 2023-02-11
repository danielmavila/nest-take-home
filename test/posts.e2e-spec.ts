import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
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
    return request(app.getHttpServer())
      .post('/posts')
      .send({ text: 'My post text' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Title is required',
        error: 'Bad Request',
      });
  });

  it('returns an error message if the text is missing', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'My post title' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Text is required',
        error: 'Bad Request',
      });
  });
});
