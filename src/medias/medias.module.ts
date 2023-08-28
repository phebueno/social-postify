import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { MediasRepository } from './medias.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  imports: [PrismaModule],
  controllers: [MediasController],
  providers: [MediasService, MediasRepository],
  exports: [MediasRepository]
})
export class MediasModule {}
