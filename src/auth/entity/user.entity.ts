import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User{
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email: string;

    @Column()
    password: string;
}