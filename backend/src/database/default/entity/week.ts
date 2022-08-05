import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";

@Entity()
export default class Week extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  WeekRange: string;

  @Column()
  WeekInterval: string;

  @Column({
    type: "date",
  })
  PublishedAt: string;
}
