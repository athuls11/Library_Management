import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import e from 'express';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(req: e.Request, payload: any) {
    const rawToken = req.headers['authorization'].split(' ')[1];
    let users = await this.usersService.getUserByHash({ accessToken: rawToken });
    if (!users) throw new HttpException('Invalid token', 401);
    return users;
  }
}
