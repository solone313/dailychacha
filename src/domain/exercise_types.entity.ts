import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("exercise_types", { schema: "dailychacha" })
export class ExerciseTypes {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "ID" })
  id: string;

  @Column("varchar", {
    name: "exercise_type",
    comment: "운동 종류",
    length: 64,
  })
  exerciseType: string;
}
