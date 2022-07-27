import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/users/interfaces/user.interface';
import { BooksDto } from '../dto';
import { BooksService } from '../service/books.service';
import { storage } from '../../config/storage.config';
import { Observable, of } from 'rxjs';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post('new')
  async createBook(@Body() booksDto: BooksDto) {
    try {
      let book = await this.booksService.createBook({ booksDto });
      return {
        message: 'New book created successfully',
        book,
      };
    } catch (error) {
      throw new HttpException('Book already exist', 400);
    }
  }

  // @UseGuards(JwtGuard, RolesGuard)
  @UseGuards(JwtGuard)
  @Get('')
  async getAllBooks(@GetUser() books: BooksDto) {
    return this.booksService.getAllBooks();
  }

  @UseGuards(JwtGuard)
  @Get(':_id')
  async findBookById(@Param('_id') _id: string) {
    const book = await this.booksService.findBookById(_id);
    if (!book) throw new HttpException('book not found', 400);
    return book;
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Put('add/:_id')
  async addBook(@Param('_id') _id: string) {
    const book = await this.booksService.addBook(_id, {
      $inc: { stock: 1 },
    });
    return { message: 'Book added successfully', book };
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Put('remove/:_id')
  async removeBook(@Param('_id') _id: string) {
    const book = await this.booksService.removeBook(_id, {
      $inc: { stock: -1 },
    });
    return { message: 'Book removed successfully', book };
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('delete/:_id')
  async deleteBook(@Param('_id') _id: string) {
    let books = await this.booksService.findBookById(_id);
    if (!books) throw new HttpException('Book doess not exist', 400);
    await this.booksService.deleteBook(_id);
    return { message: 'Book deleted successfully', data: {} };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file): Observable<Object> {
    console.log(file);
    return of({ imagePath: file.filename });
  }
}
