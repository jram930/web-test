import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'

import { Restaurant } from '.'

@Table({ tableName: 'inventory' })
export class Inventory extends Model<Inventory> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @ForeignKey(() => Restaurant)
  @Column({
	unique: 'inventory_unique',
  })
  restaurant_id: number

  @Column
  quantity: number

  @Column({
	unique: 'inventory_unique',
  })
  party_size: number

  @Column({
	unique: 'inventory_unique',
  })
  time: number

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
