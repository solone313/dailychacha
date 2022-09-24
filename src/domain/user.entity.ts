import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("email", ["email"], { unique: true })
@Entity("users", { schema: "dailychacha" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", unique: true, length: 320 })
  email: string;

  @Column("char", { name: "password", nullable: true, length: 60 })
  password: string | null;

  @Column("timestamp", { name: "expired_at", nullable: true })
  expiredAt: Date | null;

  @Column("tinyint", {
    name: "is_onboarding_completed",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isOnboardingCompleted: boolean | null;

  @Column("bigint", { name: "level", comment: "레벨", default: () => "'1'" })
  level: string;

  @Column("bigint", {
    name: "experience",
    comment: "경험치",
    default: () => "'0'",
  })
  experience: string;

  @Column("varchar", { name: "access_token", comment: "토큰", length: 1253 })
  accessToken: string;
}
