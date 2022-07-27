import { ForbiddenException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { UserInterface } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserInterface>,
    private readonly authService: AuthService,
  ) {}

  async signup({
    userDto,
  }: {
    userDto: CreateUserDto;
  }): Promise<UserInterface & { _id: string }> {
    const hash = await argon.hash(userDto.password);

    const user = new this.userModel({
      username: userDto.username,
      email: userDto.email,
      password: hash,
      role: userDto.role,
    });

    return user.save();
  }

  // async signin({ userDto }: { userDto: UserDto }): Promise<Object> {
  //   return await this.userModel.find({ email: userDto.email });
  // }

  async getUserByEmail(email: string): Promise<any> {
    return await this.userModel.find({ email: email });
  }

  async getUserById(id: string): Promise<any> {
    return await this.userModel.find({ _id: id });
  }

  async updateUserToken(email: string, token: Object) {
    const filter = { email: email };
    return await this.userModel
      .findOneAndUpdate(filter, token, {
        new: true,
        fields: {
          _id: 1,
          username: 1,
          email: 1,
          role: 1,
          password: 0,
          accessToken: 0,
          refreshToken: 0,
        },
      })
      .exec();
  }

  // async refreshTokens(id: string, rt: string) {
  //   const user = await this.getUserById(id);

  //   if (!user) throw new ForbiddenException('Access Denied');

  //   const rtMatches = await argon.verify(rt, user.accessToken);
  //   if (!rtMatches) throw new ForbiddenException('Access Denied');

  //   let token: string = await this.authService.generateJWT(
  //     user.email,
  //     user._id,
  //   );
  //   await this.updateUserToken(user.email, {
  //     accessToken: token['access_token'],
  //     refreshToken: token['refresh_token'],
  //   });

  //   return token;
  // }

  async getUserByHash(token: Object) {
    return await this.userModel.findOne(token);
  }

  async getAllUser() {
    return await this.userModel.find().exec();
  }

  async updateUser(id: string, userDto: CreateUserDto) {
    const hash = await argon.hash(userDto.password);
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          email: userDto.email,
          password: hash,
          role: userDto.role,
        },
        {
          new: true,
          fields: {
            _id: 1,
            email: 1,
            role: 1,
            password: 0,
            accessToken: 0,
            refreshToken: 0,
          },
        },
      )
      .exec();
  }

  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  // end

  // public async findAll(): Promise<(UserInterface & { _id: string })[]> {
  //   const users = await this.userModel.find().exec();
  //   if (!users || !users[0]) {
  //     throw new HttpException('Not Found', 404);
  //   }
  //   return users;
  //   // return `This action returns all users`;
  // }

  // public async findOne({
  //   _id,
  // }: {
  //   _id: string;
  // }): Promise<UserInterface & { _id: string }> {
  //   const user = await this.userModel.findOne({ _id }).exec();
  //   if (!user) {
  //     throw new HttpException('Not Found', 404);
  //   }
  //   return user;
  //   // return `This action returns a #${id} user`;
  // }

  // public async update({
  //   _id,
  //   propertyName,
  //   propertyValue,
  // }: {
  //   _id: string;
  //   userDto: UserDto;
  //   propertyName: string;
  //   propertyValue: string;
  // }): Promise<UserInterface & { _id: any }> {
  //   const user = await this.userModel
  //     .findOneAndUpdate(
  //       { _id },
  //       {
  //         [propertyName]: propertyValue,
  //       },
  //     )
  //     .exec();
  //   if (!user) {
  //     throw new HttpException('Not Found', 404);
  //   }
  //   return user;
  //   // return `This action updates a #${id} user`;
  // }

  // public async remove({ _id }: { _id: string; }) {
  //   const user = await this.userModel.deleteOne({ _id }).exec();
  //   if (user.deletedCount === 0) {
  //     throw new HttpException('Not Found', 404);
  //   }
  //   return user;
  // return `This action removes a #${id} user`;
  // }
}
