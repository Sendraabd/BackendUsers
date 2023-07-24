import { Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './Users';

@Index('pk_entity_id', ['entityId'], { unique: true })
@Entity('business_entity', { schema: 'users' })
export class BusinessEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'entity_id' })
  entityId: number;

  @OneToOne(() => Users, (users) => users.userEntity)
  users: Users;
}
