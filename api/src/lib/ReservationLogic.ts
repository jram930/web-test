import { Reservation } from '../models'
import { Request } from 'express'
import { TimeUtil } from './TimeUtil'
import { RestaurantLookup } from './RestaurantLookup'
import { InventoryLookup } from './InventoryLookup'

export class ReservationLogic {

	timeUtil: TimeUtil
	restaurantLookup: RestaurantLookup
	inventoryLookup: InventoryLookup

	constructor() {
		this.timeUtil = new TimeUtil()
		this.restaurantLookup = new RestaurantLookup()
		this.inventoryLookup = new InventoryLookup()
	}

	public postCheckValidRequest(req: Request) {
		if (!req || !req.body) return false
		const {
			restaurantName,
			name,
			email,
			partySize,
			date,
			time
		} = req.body

		// Parameters not provided at all
		if (!name || !restaurantName || !email || !date || time === undefined || partySize === undefined) return false

		// Check if time is valid
		if (time && !this.timeUtil.isTimeValid(time)) return false

		return true
	}

	public async getAllReservations() {
		return await Reservation.findAll()
	}

	public async getReservationByIdCheckValidRequest(req) {
		if(!req || !req.params || !req.params.id) return false
		return true
	}

	public async getReservationById(id) {
		return await Reservation.findOne({where: {id}})
	}

	public async createReservationIfInventoryAllows(opts: ReservationOptions) {

		const restaurantId = await this.restaurantLookup.getRestuarantId(opts.restaurantName)
		if (!restaurantId) throw 'Invalid restaurant'
		const inventory = await this.inventoryLookup.getInventoryForRestaurantAtTimeForPartySize(restaurantId, opts)

		if (inventory) {
			const existingReservations = await this.getReservationsAtSameDateTimeAndPartySize(restaurantId, opts)
			if(existingReservations.length < inventory.quantity) {
				await this.createReservation(restaurantId, opts)
			} else {
				throw 'Not enough inventory to support the reservation'
			}			
		} else {
			throw 'No valid inventory for restaurant'
		}
	}

	private async createReservation(restaurantId, opts) {
		await Reservation.create({
			name: opts.name,
			restaurant_id: restaurantId,
			email: opts.email,
			party_size: opts.partySize,
			date: opts.date,
			time: opts.time
		})
	}

	private async getReservationsAtSameDateTimeAndPartySize(restaurantId: number, opts: ReservationOptions) {
		return await Reservation.findAll({
			where: {
				restaurant_id: restaurantId,
				date: opts.date,
				time: opts.time
			}
		})
	}

}

class ReservationOptions {
	name: string
	restaurantName: string
	email: string
	partySize: number
	date: Date
	time: number
}
