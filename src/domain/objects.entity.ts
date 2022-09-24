import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("objects", { schema: "dailychacha" })
export class Objects {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "ID" })
  id: string;

  @Column("varchar", {
    name: "object_type",
    comment: "오브젝트 유형",
    length: 255,
  })
  objectType: string;

  @Column("varchar", {
    name: "object_name",
    comment: "오브젝트 이름",
    length: 255,
  })
  objectName: string;

  @Column("varchar", { name: "image_url", comment: "이미지 URL", length: 255 })
  imageUrl: string;
}
