import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Media } from '../factories/medias.factory';
import { Post } from '../factories/posts.factory';

describe('Posts (e2e)', () => {
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

  it('POST /posts => should post new post', async () => {
    const post = new Post();

    await request(app.getHttpServer())
      .post('/posts')
      .send(post)
      .expect(HttpStatus.CREATED);
    const newPost = await prisma.post.findFirst({
      where: { title: post.title },
    });

    expect(newPost).not.toBe(null);
  });

  it('GET /posts => should get all posts', async () => {
    const posts = await prisma.post.createMany({
      data: [new Post(), new Post(), new Post()],
    });

    const result = await request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK);

    expect(result.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          title: expect.any(String),
          text: expect.any(String),
          image: expect.any(String),
        },
      ]),
    );
  });

  it('GET /posts/:id => should get post by id', async () => {
    const post = await prisma.post.create({
      data: new Post(),
    });

    const result = await request(app.getHttpServer())
      .get(`/posts/${post.id}`)
      .expect(HttpStatus.OK);

    expect(result.body).toEqual(post);
  });

  it('DELETE /posts/:id => should delete posts by id', async () => {
    const posts = await prisma.post.create({
      data: new Post(),
    });

    const result = await request(app.getHttpServer())
      .delete(`/posts/${posts.id}`)
      .expect(HttpStatus.OK);

    expect(result.body).toEqual(posts);
  });

  it('UPDATE /posts/:id => should update post by id', async () => {
    const posts = await prisma.post.create({
      data: new Post(),
    });
    const update = { title: 'newTitle', text: 'newTextTeext TExt' };
    const result = await request(app.getHttpServer())
      .put(`/posts/${posts.id}`)
      .send(update)
      .expect(HttpStatus.OK);

    expect(result.body).toEqual({ id: posts.id, ...update, image:posts.image });
  });
});
