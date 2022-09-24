import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_user_exercise_records_u1", ["userExerciseHistoryId"], {
  unique: true,
})
@Entity("user_exercise_records", { schema: "dailychacha" })
export class UserExerciseRecords {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "ID" })
  id: string;

  @Column("bigint", {
    name: "user_exercise_history_id",
    unique: true,
    comment: "유저 운동 기록 id",
  })
  userExerciseHistoryId: string;

  @Column("bigint", { name: "exercise_type_id", comment: "운동 종류 id" })
  exerciseTypeId: string;

  @Column("bigint", {
    name: "exercise_body_part_id",
    comment: "운동 신체 부위 id",
  })
  exerciseBodyPartId: string;
}
