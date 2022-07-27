import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BooksDto } from '../dto';
import { BooksInterface } from '../interfaces/book.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('Books') private readonly booksModel: Model<BooksInterface>,
  ) {}

  async createBook({
    booksDto,
  }: {
    booksDto: BooksDto;
  }): Promise<BooksInterface & { _id: string }> {
    const book = new this.booksModel({
      title: booksDto.title,
      ISBN: booksDto.ISBN,
      author: booksDto.author,
      stock: booksDto.stock,
      description: booksDto.description,
      category: booksDto.category,
    });

    return book.save();
  }

  async getAllBooks() {
    return await this.booksModel.find().exec();
  }

  async findBookById(id: string): Promise<any> {
    return await this.booksModel.findById({ _id: id });
  }

  async findBookStock(id: string): Promise<any> {
    return (await this.booksModel.findById({ _id: id })).stock;
  }

  async addBook(id: string, body: Object) {
    return await this.booksModel.findByIdAndUpdate(id, body, { new: true });
  }

  async removeBook(id: string, body: Object) {
    let stock = await this.findBookStock(id);
    if (stock === 0) throw new HttpException('Book is not available', 400);
    return await this.booksModel.findByIdAndUpdate(id, body, { new: true });
  }

  async deleteBook(id: string) {
    return await this.booksModel.findByIdAndDelete(id);
  }
}
