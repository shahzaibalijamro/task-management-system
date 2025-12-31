import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>
    ) {}

    async getUserByUsername(username: string): Promise<User | null>{
        return await this.user.findOne({where: {username}})
    }

    async createUser(body: CreateUserDto): Promise<void>{
        const {username,password} = body;
        const existingUser = await this.getUserByUsername(username);
        if (existingUser) {
            throw new BadRequestException('This user already exists, either signin or choose a different username!')
        }
        try {
            await this.user.save({
                username,
                password,
            })
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('Username already exists');
            }
            throw error;
        }
    }
}
