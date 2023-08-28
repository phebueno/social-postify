import { faker } from "@faker-js/faker";

export class Media{
    title: string;
    username: string;
    constructor(){
        this.title = faker.lorem.lines();
        this.username = faker.internet.userName();
    }
}