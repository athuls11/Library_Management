import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../interfaces/user.interface';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  readonly password: string;

  @IsEnum([null, Role.ADMIN, Role.USER])
  readonly role: Role;
}
