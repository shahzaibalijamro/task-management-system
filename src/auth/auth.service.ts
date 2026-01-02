import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id: userId } });
  }

  async createUser(body: AuthCredentialsDto): Promise<void> {
    const { username, password } = body;
    const existingUser = await this.getUserByUsername(username);
    if (existingUser) {
      throw new ConflictException(
        'This user already exists, either signin or choose a different username!',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await this.userRepo.save({
        username,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async loginUser(body: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = body;

    const user = await this.getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    const accessToken: string = await this.jwtService.signAsync({
      sub: user.id,
    });

    return { accessToken };
  }
}
