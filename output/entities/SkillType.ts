import { Column, Entity, Index, OneToMany } from "typeorm";
import { UsersSkill } from "./UsersSkill";

@Index("pk_skty_name", ["sktyName"], { unique: true })
@Entity("skill_type", { schema: "users" })
export class SkillType {
  @Column("character varying", { primary: true, name: "skty_name", length: 15 })
  sktyName: string;

  @OneToMany(() => UsersSkill, (usersSkill) => usersSkill.uskiSktyName)
  usersSkills: UsersSkill[];
}
