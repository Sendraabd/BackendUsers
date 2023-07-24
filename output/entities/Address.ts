import { Entity, Index, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersAddress } from "./UsersAddress";

@Index("pk_addr_id", ["addrId"], { unique: true })
@Entity("address", { schema: "users" })
export class Address {
  @PrimaryGeneratedColumn({ type: "integer", name: "addr_id" })
  addrId: number;

  @OneToOne(() => UsersAddress, (usersAddress) => usersAddress.etadAddr)
  usersAddress: UsersAddress;
}
