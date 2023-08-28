import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PostsRepository } from './posts.repository';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsRepository]
})
export class PostsModule {}
