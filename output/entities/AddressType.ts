import { Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersAddress } from "./UsersAddress";

@Index("pk_adty_id", ["adtyId"], { unique: true })
@Entity("address_type", { schema: "users" })
export class AddressType {
  @PrimaryGeneratedColumn({ type: "integer", name: "adty_id" })
  adtyId: number;

  @OneToMany(() => UsersAddress, (usersAddress) => usersAddress.etadAdty)
  usersAddresses: UsersAddress[];
}
