import {
	Column,
	CreatedAt,
	DeletedAt,
	Model,
	PrimaryKey, Table,
	ForeignKey,
	UpdatedAt
} from 'sequelize-typescript'

import { Restaurant } from '.'

@Table({ tableName: 'reservation' })
export class Reservation extends Model<Reservation> {
	@PrimaryKey
	@Column({ autoIncrement: true })
	id: number

	@ForeignKey(() => Restaurant)
	@Column
	restaurant_id: number

	@Column
	name: string

	@Column({
		unique: 'reservation_unique',
	})
	email: string

	@Column
	party_size: string

	@Column({
		unique: 'reservation_unique',
	})
	date: Date

	@Column({
		unique: 'reservation_unique',
	})
	time: number

	@DeletedAt
	deleted_at: string

	@CreatedAt
	created_at: string

	@UpdatedAt
	updated_at: string
}
