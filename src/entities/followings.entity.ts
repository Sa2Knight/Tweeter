import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { User } from './user.entity'

@Entity()
@Unique(['fromUser', 'toUser'])
export class Followings extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @ManyToOne(_ => User)
  fromUser!: User

  @ManyToOne(_ => User)
  toUser!: User

  @CreateDateColumn()
  readonly createdAt!: Date
}
