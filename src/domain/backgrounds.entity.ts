import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("backgrounds", { schema: "dailychacha" })
export class Backgrounds {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "ID" })
  id: string;

  @Column("varchar", { name: "image_url", comment: "이미지 URL", length: 255 })
  imageUrl: string;
}
