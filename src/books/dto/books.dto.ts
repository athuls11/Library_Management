import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class BooksDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly ISBN: string;

  @IsNotEmpty()
  readonly author: string;

  @IsNumber()
  // @MinLength(0)
  readonly stock: number;

  @IsString()
  readonly description: string;

  @IsString()
  readonly category: string;
}
