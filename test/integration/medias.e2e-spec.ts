import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Media } from '../factories/medias.factory';

describe('Medias (e2e)', () => {
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

  it('POST /medias => should post new media', async () => {
    const media = new Media();
    await request(app.getHttpServer())
      .post('/medias')
      .send(media)
      .expect(HttpStatus.CREATED);

    const mediapost = await prisma.media.findFirst({
      where: { title: media.title },
    });

    expect(mediapost).not.toBe(null);
  });

  it('GET /medias => should get all medias', async () => {
    const postmedias = await prisma.media.createMany({
      data: [new Media(), new Media(), new Media()],
    });

    const result = await request(app.getHttpServer())
      .get('/medias')
      .expect(HttpStatus.OK);

    expect(result.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          title: expect.any(String),
          username: expect.any(String),
        },
      ]),
    );
  });

  it('GET /medias/:id => should get media by id', async () => {
    const postmedias = await prisma.media.create({
      data: new Media(),
    });

    const result = await request(app.getHttpServer())
      .get(`/medias/${postmedias.id}`)
      .expect(HttpStatus.OK);

    expect(result.body).toEqual(postmedias);
  });

  it('DELETE /medias/:id => should delete media by id', async () => {
    const postmedias = await prisma.media.create({
      data: new Media(),
    });

    const result = await request(app.getHttpServer())
      .delete(`/medias/${postmedias.id}`)
      .expect(HttpStatus.OK);

    expect(result.body).toEqual(postmedias);
  });

  it('UPDATE /medias/:id => should update media by id', async () => {
    const postmedias = await prisma.media.create({
      data: new Media(),
    });
    const update = { title: 'newTitle', username: 'newUser' };
    const result = await request(app.getHttpServer())
      .put(`/medias/${postmedias.id}`)
      .send(update)
      .expect(HttpStatus.OK);

    expect(result.body).toEqual({ id: postmedias.id, ...update });
  });
});
