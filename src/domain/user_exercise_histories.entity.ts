import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_exercise_histories", { schema: "dailychacha" })
export class UserExerciseHistories {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "ID" })
  id: string;

  @Column("bigint", { name: "user_id", comment: "사용자 ID" })
  userId: string;

  @Column("timestamp", { name: "exercise_date", comment: "운동일" })
  exerciseDate: Date;

  @Column("timestamp", {
    name: "exercise_started_at",
    comment: "운동 시작 시간",
  })
  exerciseStartedAt: Date;

  @Column("timestamp", {
    name: "exercise_ended_at",
    nullable: true,
    comment: "운동 종료 시간",
  })
  exerciseEndedAt: Date | null;
}
