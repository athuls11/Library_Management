import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  HttpCode,
  BadRequestException,
  HttpException,
  Req,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { AuthService } from 'src/auth/service/auth.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { LoginUserDto, CreateUserDto } from '../dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '../interfaces/user.interface';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BooksService } from 'src/books/service/books.service';
import { PublishBookService } from 'src/publish-book/service/publish-book.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly booksService: BooksService, // private readonly jwtService: JwtStrategy,
    private readonly publishBookService: PublishBookService,
  ) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('signup')
  async signup(@Body() userDto: CreateUserDto) {
    let user = await this.usersService.getUserByEmail(userDto.email);
    if (user.length) throw new BadRequestException('Email already exists');
    let users = await this.usersService.signup({ userDto });
    return {
      message: 'User signed up successfully',
      users,
    };
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() loginUserDto: LoginUserDto) {
    let users = await this.usersService.getUserByEmail(loginUserDto.email);
    if (!users.length) throw new HttpException('Incorrect Email', 400);

    let user = users[0];
    let ismatch: boolean = await this.authService.comparePasswords(
      user.password,
      loginUserDto.password,
    );
    if (!ismatch) throw new HttpException('Incorrect Password', 400);

    let access_token: string = await this.authService.generateAccessToken(
      user.email,
      user._id,
    );

    let refresh_token: string = await this.authService.generateRefreshToken(
      user.email,
      user._id,
    );

    if (access_token) {
      var updated_user = await this.usersService.updateUserToken(user.email, {
        accessToken: access_token,
        refreshToken: refresh_token,
      });
    }

    return {
      message: 'User signed in successfully',
      data: {
        accessToken: `Bearer ${access_token}`,
        refreshToken: `Bearer ${refresh_token}`,
        user: updated_user,
      },
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Request() req) {
    let token = req.body.token;
    let user = await this.usersService.getUserByHash({ refreshToken: token });
    if (!user) throw new HttpException('user not authenticated', 401);
    let access_token = await this.authService.generateAccessToken(
      user.email,
      user._id,
    );
    if (access_token) {
      await this.usersService.updateUserToken(user.email, {
        accessToken: access_token,
      });
    }
    return {
      accessToken: access_token,
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('signout')
  @HttpCode(200)
  async userLogout(@Request() req) {
    let email = req.body.email;
    await this.usersService.updateUserToken(email, {
      accessToken: '',
      refreshToken: '',
    });
    return { message: 'User signed out successfully', data: {} };
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @Get('all')
  getAll() {
    return this.usersService.getAllUser();
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @Get('one')
  getOne(@GetUser() user: Object) {
    return user;
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':_id')
  async updateUser(@Param('_id') _id: string, @Body() userDto: CreateUserDto) {
    return await this.usersService.updateUser(_id, userDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':_id')
  async deleteUser(@Param('_id') _id: string) {
    let users = await this.usersService.getUserById(_id);
    if (!users.length) throw new HttpException('User is not exist', 400);
    await this.usersService.deleteUser(_id);
    return { message: 'User deleted successfully', data: {} };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post('purchase/:_id')
  async purchaseBook(@Param('_id') _id: string, @GetUser() user) {
    const purchased = await this.publishBookService.published(user._id, _id);
    if (purchased.length)
      throw new HttpException('You already purchased this book', 400);
    await this.booksService.removeBook(_id, {
      $inc: { stock: -1 },
    });
    await this.publishBookService.publishBook(user._id, _id);
    const purchased_book = await this.booksService.findBookById(_id);

    return { message: 'Book purchased successfully', purchased_book };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post('return/:_id')
  async returnBook(@Param('_id') _id: string, @GetUser() user) {
    const purchased = await this.publishBookService.published(user._id, _id);
    if (purchased.length) {
      await this.booksService.addBook(_id, {
        $inc: { stock: 1 },
      });
    } else throw new HttpException('Not available to return', 400);
    await this.publishBookService.returnBook(user._id, _id);
    const returned_book = await this.booksService.findBookById(_id);

    return { message: 'Book returned successfully', returned_book };
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('published')
  async getPublishedBooks() {
    const published_books = await this.publishBookService.getPublishedBooks();

    return { message: 'List of published books', published_books };
  }

  // end

  // @Get(':_id')
  // findOne(@Param('_id') _id: string) {
  //   return this.usersService.findOne({ _id });
  // }

  // @Put(':_id')
  // update(@Param('_id') _id: string, @Body() userDto: UserDto, @Query() query) {
  //   const propertyName = query.property_name;
  //   const propertyValue = query.property_value;
  //   return this.usersService.update({
  //     _id,
  //     userDto,
  //     propertyName,
  //     propertyValue,
  //   });
  // }

  // @Get('/all')
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get('/all')
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Delete(':_id')
  // remove(@Param('_id') _id: string) {
  //   return this.usersService.remove({ _id });
  // }
}
