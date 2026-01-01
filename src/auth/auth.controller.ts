import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signUp(
        @Body() body: CreateUserDto
    ): Promise<void>{
        await this.authService.createUser(body);
    }
}
