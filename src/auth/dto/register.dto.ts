import { Equals, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3, {
    message: 'Nickname cannot be less than 3 characters',
  })
  nickname: string;

  @IsString()
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters',
  })
  password: string;

  @IsString()
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters',
  })
  confirmPassword: string;
}
