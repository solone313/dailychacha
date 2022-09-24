import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ type : 'text',  nullable: true })
    access_token: string;

    @Column({ type: 'timestamp', nullable: true })
    expired_at: Date;

    @Column({ nullable: true, default: 0 })
    is_onboarding_completed: boolean;

    @Column({default: 1})
    level: number;
    
    @Column({default: 0})
    experience: number;
}
