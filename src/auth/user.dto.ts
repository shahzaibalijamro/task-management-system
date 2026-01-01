import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Password too weak' },
  )
  password: string;
}

export class UserWithoutPass{
  username: string;

  id: string
}