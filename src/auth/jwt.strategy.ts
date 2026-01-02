import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

export interface Payload {
    sub: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET')!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<User> {
    const {sub} = payload;
    const user =  await this.authService.getUserById(sub);
    if (!user) {
        throw new UnauthorizedException('Invalid token or user not found');
    }
    return user;
  }
}
