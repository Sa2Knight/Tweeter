import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  text!: string

  @ManyToOne(_ => User, user => user.tweets)
  user!: User

  @CreateDateColumn()
  readonly createdAt!: Date
}
