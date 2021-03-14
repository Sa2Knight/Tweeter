import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Tweet } from './tweet.entity'
import { User } from './user.entity'

@Entity()
@Unique(['user', 'tweet'])
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @ManyToOne(_ => User)
  user!: User

  @ManyToOne(_ => Tweet)
  tweet!: Tweet

  @CreateDateColumn()
  readonly createdAt!: Date
}
