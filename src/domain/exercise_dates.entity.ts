import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("exercise_dates", { schema: "dailychacha" })
export class ExerciseDates {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "exercise_date" })
  exerciseDate: number;

  @Column("varchar", { name: "exercise_date_en", length: 320 })
  exerciseDateEn: string;

  @Column("int", { name: "exercise_time", nullable: true })
  exerciseTime: number | null;
}
