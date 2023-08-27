import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly repository:PostsRepository) {
  }
  async create(body: CreatePostDto) {
    return this.repository.create(body);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const post = await this.repository.findOne(id);
    if(!post) throw new NotFoundException("Post not found!")
    return post;
  }

  async update(id: number, body: CreatePostDto) {
    const post = await this.repository.findOne(id);
    if(!post) throw new NotFoundException("Post not found!")
    return this.repository.update(id, body);
  }

  async remove(id: number) {
    const post = await this.repository.findOne(id);
    if(!post) throw new NotFoundException("Post not found!")
    return this.repository.remove(id);
  }
}
