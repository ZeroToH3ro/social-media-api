import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  content: string;

  @IsInt()
  @IsNotEmpty()
  postId: number;
}
