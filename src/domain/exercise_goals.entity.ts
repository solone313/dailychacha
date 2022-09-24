import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_id", ["userId"], { unique: true })
@Entity("exercise_goals", { schema: "dailychacha" })
export class ExerciseGoals {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", unique: true })
  userId: number;

  @Column("varchar", { name: "exercise_goal", length: 320 })
  exerciseGoal: string;
}
