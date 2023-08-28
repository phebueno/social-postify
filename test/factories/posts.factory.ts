import { faker } from '@faker-js/faker';

export class Post {
  title: string;
  text: string;
  image?: string;
  constructor() {
    this.title = faker.lorem.words({ min: 1, max: 3 });
    this.text = faker.lorem.text();
    this.image = faker.internet.url();
  }
}
