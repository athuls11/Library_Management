import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BooksService } from 'src/books/service/books.service';
import { UsersService } from 'src/users/service/users.service';
import { PublishBookInterface } from '../interfaces/publish-book.interface';

@Injectable()
export class PublishBookService {
  constructor(
    @InjectModel('Publish_books')
    private readonly publishModel: Model<PublishBookInterface>,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}

  async publishBook(
    user_id: string,
    book_id: string,
  ): Promise<PublishBookInterface & { _id: string }> {
    const users = await this.usersService.getUserById(user_id);
    const user = users[0];
    const book = await this.booksService.findBookById(book_id);
    const publish_book = new this.publishModel({
      user_id: {
        id: user._id,
        username: user.username,
      },
      book_info: {
        id: book._id,
        title: book.title,
        ISBN: book.ISBN,
        author: book.author,
        stock: book.stock,
        description: book.description,
        category: book.category,
      },
    });

    return publish_book.save();
  }

  async published(user_id: string, book_id: string) {
    return await this.publishModel.find({
      'user_id.id': user_id,
      'book_info.id': book_id,
    });
  }

  async returnBook(user_id: string, book_id: string) {
    return await this.publishModel.findOneAndRemove({
      'user_id.id': user_id,
      'book_info.id': book_id,
    });
  }

  async getPublishedBooks() {
    return await this.publishModel.find({});
  }
}
