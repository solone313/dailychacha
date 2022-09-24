import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("exercise_body_parts", { schema: "dailychacha" })
export class ExerciseBodyParts {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "ID" })
  id: string;

  @Column("varchar", {
    name: "exercise_body_part",
    comment: "운동 신체 부위",
    length: 64,
  })
  exerciseBodyPart: string;
}
