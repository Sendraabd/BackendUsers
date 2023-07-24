import { Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersExperiences } from "./UsersExperiences";

@Index("pk_city_id", ["cityId"], { unique: true })
@Entity("city", { schema: "users" })
export class City {
  @PrimaryGeneratedColumn({ type: "integer", name: "city_id" })
  cityId: number;

  @OneToMany(
    () => UsersExperiences,
    (usersExperiences) => usersExperiences.usexCity
  )
  usersExperiences: UsersExperiences[];
}
