import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Media } from '../factories/medias.factory';
import { Post } from '../factories/posts.factory';
import { faker } from '@faker-js/faker';

describe('Publications (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    //clean db
    await prisma.publication.deleteMany();
    await prisma.post.deleteMany();
    await prisma.media.deleteMany();

    await app.init();
  });

  it('POST /publications => should post new publication', async () => {
    const newMedia = await prisma.media.create({ data: new Media() });
    const newPost = await prisma.post.create({ data: new Post() });
    const media = new Media();
    const result = await request(app.getHttpServer())
      .post('/publications')
      .send({
        postId: newPost.id,
        mediaId: newMedia.id,
        date: '2023-08-21T13:25:17.352Z',
      })
      .expect(HttpStatus.CREATED);

    const mediapost = await prisma.publication.findFirst({
      where: { postId: newPost.id },
    });

    expect(mediapost).not.toBe(null);
  });

  it('GET /publications => should get all publications', async () => {
    const newMedia = await prisma.media.create({ data: new Media() });
    const newPost = await prisma.post.create({ data: new Post() });
    const publications = await prisma.publication.createMany({
      data: [
        {
          postId: newPost.id,
          mediaId: newMedia.id,
          date: '2023-08-21T13:25:17.352Z',
        },
        {
          postId: newPost.id,
          mediaId: newMedia.id,
          date: '2023-08-21T13:25:17.352Z',
        },
        {
          postId: newPost.id,
          mediaId: newMedia.id,
          date: '2023-08-21T13:25:17.352Z',
        },
      ],
    });

    const result = await request(app.getHttpServer())
      .get('/publications')
      .expect(HttpStatus.OK);

    expect(result.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          postId: expect.any(Number),
          mediaId: expect.any(Number),
          date: expect.any(String),
        },
      ]),
    );
  });

  it('GET /publications/:id => should get media by id', async () => {
    const newMedia = await prisma.media.create({ data: new Media() });
    const newPost = await prisma.post.create({ data: new Post() });
    const publication = await prisma.publication.create({
      data: {
        postId: newPost.id,
        mediaId: newMedia.id,
        date: '2023-08-21T13:25:17.352Z',
      },
    });

    const result = await request(app.getHttpServer())
      .get(`/publications/${publication.id}`)
      .expect(HttpStatus.OK);

    const { date: dateModel, ...pubModel } = publication;

    expect(result.body).toEqual({
      date: dateModel.toISOString(),
      ...pubModel,
    });
  });

  it('DELETE /publications/:id => should delete publication by id', async () => {
    const newMedia = await prisma.media.create({ data: new Media() });
    const newPost = await prisma.post.create({ data: new Post() });
    const publication = await prisma.publication.create({
      data: {
        postId: newPost.id,
        mediaId: newMedia.id,
        date: '2023-08-21T13:25:17.352Z',
      },
    });

    const result = await request(app.getHttpServer())
      .delete(`/publications/${publication.id}`)
      .expect(HttpStatus.OK);

    const { date: dateModel, ...pubModel } = publication;

    expect(result.body).toEqual({
      date: dateModel.toISOString(),
      ...pubModel,
    });
  });

  it('UPDATE /publications/:id => should update publication by id', async () => {
    const newMedia = await prisma.media.create({ data: new Media() });
    const newPost = await prisma.post.create({ data: new Post() });
    const publication = await prisma.publication.create({
      data: {
        postId: newPost.id,
        mediaId: newMedia.id,
        date: faker.date.future(),
      },
    });

    const update = {
      postId: newPost.id,
      mediaId: newMedia.id,
      date: '2023-08-21T13:25:17.352Z',
    };
    const result = await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send(update)
      .expect(HttpStatus.OK);

    expect(result.body).toEqual({ id: publication.id, ...update, date: update.date.toString() });
  });
});
