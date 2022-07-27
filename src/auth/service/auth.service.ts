import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import bcrypt from 'bcrypt';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async comparePasswords(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const pwMatches: boolean = await argon.verify(password, passwordHash);
    return pwMatches;
  }

  // async generateJWT(email: string, id: string): Promise<string> {
  //   let payload = { email, id };
  //   return this.jwtService.signAsync(payload);
  // }

  async generateAccessToken(email: string, id: string): Promise<string> {
    let payload = { email, id };
    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '5m',
    });
  }

  async generateRefreshToken(email: string, id: string): Promise<string> {
    let payload = { email, id };
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '5d',
    });
  }

  // async generateJWT(email: string, id: string): Promise<any> {
  //   const [at, rt] = await Promise.all([
  //     this.jwtService.signAsync(
  //       {
  //         email: email,
  //         id,
  //       },
  //       {
  //         secret: 'ACCESS_TOKEN_SECRET',
  //         expiresIn: '25m',
  //       },
  //     ),
  //     this.jwtService.signAsync(
  //       {
  //         email: email,
  //         id,
  //       },
  //       {
  //         secret: 'REFRESH_TOKEN_SECRET',
  //         expiresIn: 60 * 60 * 24,
  //       },
  //     ),
  //   ]);
  //   return {
  //     access_token: at,
  //     refresh_token: rt,
  //   };
  //   // const payload = { email: email, id };
  //   // return await this.jwtService.signAsync(payload);
  // }

  // end
  async hashPassword({
    Password,
  }: {
    Password: string;
  }): Promise<Observable<string>> {
    return from<string>(await bcrypt.hash(Password, 12));
  }
}
