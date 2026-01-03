import { Task } from "../task/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @OneToMany(() => Task, task => task.user, {eager: false})
    tasks: Task[];
}