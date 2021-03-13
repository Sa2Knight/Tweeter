import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  BaseEntity
} from 'typeorm'
import { Tweet } from './tweet.entity'

@Entity()
@Unique(['name'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  name!: string

  @Column()
  displayName!: string

  @Column()
  description!: string

  @Column()
  password!: string

  @OneToMany(_ => Tweet, tweet => tweet.user)
  tweets!: Tweet[]

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date

  constructor(params: { name: string; displayName: string; description?: string }) {
    super()
    Object.assign(this, {
      password: '1q2w3e4r5t6y',
      ...params
    })
  }
}
