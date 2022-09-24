import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_objects", { schema: "dailychacha" })
export class UserObjects {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "ID" })
  id: string;

  @Column("bigint", { name: "user_id", comment: "사용자 ID" })
  userId: string;

  @Column("bigint", { name: "object_id", comment: "오브젝트 ID" })
  objectId: string;

  @Column("timestamp", {
    name: "created_at",
    comment: "생성 일시",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", { name: "exercise_date", comment: "운동일" })
  exerciseDate: Date;
}
