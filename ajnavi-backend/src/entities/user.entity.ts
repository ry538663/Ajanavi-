import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column({ type: "varchar", length: 120, unique: true }) email: string;
  @Column({ type: "varchar", length: 60, default: "Stranger" }) name: string;
  @Column({ type: "varchar", length: 30, default: "prefer-not-to-say" }) gender: string;
  @Column({ type: "varchar", length: 60, default: "India" }) country: string;
  @Column({ type: "varchar", length: 200, default: "" }) bio: string;
  @Column({ type: "simple-array", default: "Music,Tech" }) interests: string[];
  @Column({ type: "boolean", default: true }) over18: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
