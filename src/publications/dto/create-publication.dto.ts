import { IsDateString, IsInt, IsNotEmpty } from "class-validator";

export class CreatePublicationDto {
    @IsInt()
    @IsNotEmpty()
    mediaId: number;

    @IsInt()
    @IsNotEmpty()
    postId: number;

    @IsDateString()
    @IsNotEmpty()
    date: string;
}
