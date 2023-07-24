import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UsersExperiences } from "./UsersExperiences";
import { SkillType } from "./SkillType";

@Index("pk_uski_id", ["uskiEntityId", "uskiId"], { unique: true })
@Index("users_skill_uski_id_key", ["uskiId"], { unique: true })
@Entity("users_skill", { schema: "users" })
export class UsersSkill {
  @PrimaryGeneratedColumn({ type: "integer", name: "uski_id" })
  uskiId: number;

  @Column("integer", { primary: true, name: "uski_entity_id" })
  uskiEntityId: number;

  @Column("timestamp without time zone", {
    name: "uski_modified_date",
    nullable: true,
  })
  uskiModifiedDate: Date | null;

  @ManyToMany(
    () => UsersExperiences,
    (usersExperiences) => usersExperiences.usersSkills
  )
  usersExperiences: UsersExperiences[];

  @ManyToOne(() => SkillType, (skillType) => skillType.usersSkills)
  @JoinColumn([{ name: "uski_skty_name", referencedColumnName: "sktyName" }])
  uskiSktyName: SkillType;
}
