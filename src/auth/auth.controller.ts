import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, UserWithoutPass } from './user.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: AuthCredentialsDto): Promise<void> {
    this.authService.createUser(body);
  }

  @Post('signin')
  async signIn(@Body() body: AuthCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.loginUser(body);
  }
}
