import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { UsersRoles } from "./UsersRoles";

@Index("pk_role_id", ["roleId"], { unique: true })
@Index("unique_role_name", ["roleName"], { unique: true })
@Entity("roles", { schema: "users" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "integer", name: "role_id" })
  roleId: number;

  @Column("character varying", {
    name: "role_name",
    nullable: true,
    unique: true,
    length: 35,
  })
  roleName: string | null;

  @Column("character varying", {
    name: "role_type",
    nullable: true,
    length: 15,
  })
  roleType: string | null;

  @Column("timestamp without time zone", {
    name: "role_modified_date",
    nullable: true,
  })
  roleModifiedDate: Date | null;

  @OneToMany(() => Users, (users) => users.userCurrentRole)
  users: Users[];

  @OneToMany(() => UsersRoles, (usersRoles) => usersRoles.usroRole)
  usersRoles: UsersRoles[];
}
