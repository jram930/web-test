import { Inventory } from '../models'
import { RestaurantLookup } from './RestaurantLookup'
import { Request } from 'express'
import { TimeUtil } from './TimeUtil'

export class InventoryLogic {

	timeUtil: TimeUtil
	restaurantLookup: RestaurantLookup

	constructor() {
		this.timeUtil = new TimeUtil()
		this.restaurantLookup = new RestaurantLookup()
	}

	public createInventoryCheckValidRequest(req: Request) {
		if (!req || !req.body) return false
		const {
			restaurantName,
			partySize,
			quantity,
			time,
			startTime,
			stopTime
		} = req.body

		// Are the non-time fields valid
		if (!restaurantName || !partySize || !quantity) return false

		// Is either a specific time slot or a time range provided
		if (time === undefined && startTime === undefined && stopTime === undefined) return false
		if (time === undefined && (startTime === undefined || stopTime === undefined)) return false
		if(time !== undefined && (startTime !== undefined || stopTime !== undefined)) return false

		// If there's a time range, is the start earlier than the stop
		if (startTime && startTime >= stopTime) return false

		// Are all times valid times?
		if (time && !this.timeUtil.isTimeValid(time)) return false
		if (startTime && !this.timeUtil.isTimeValid(startTime)) return false
		if (stopTime && !this.timeUtil.isTimeValid(stopTime)) return false

		return true
	}

	public async getAllInventories() {
		return await Inventory.findAll()
	}

	public async getInventoryByIdCheckValidRequest(req) {
		if(!req || !req.params || !req.params.id) return false
		return true
	}

	public async getInventoryById(id) {
		return await Inventory.findOne({where: {id}})
	}

	public async createInventory(opts: InventoryOptions) {
		const restaurantId = await this.restaurantLookup.getRestuarantId(opts.restaurantName)
		if (!restaurantId) throw 'Invalid restaurant'

		if (opts.time) {
			// Single inventory time slot
			await this.createSingleInventorySlot(restaurantId, opts)
		} else {
			// Range of inventory time slots
			await this.createRangeOfInventorySlots(restaurantId, opts)
		}

		return
	}

	private async createSingleInventorySlot(restaurantId, opts) {
		return await Inventory.create({
			restaurant_id: restaurantId,
			party_size: opts.partySize,
			quantity: opts.quantity,
			time: opts.time
		})
	}

	private async createRangeOfInventorySlots(restaurantId, opts) {
		let toInsert = []
		let currentTime = opts.startTime
		while(currentTime <= opts.stopTime) {
			toInsert.push({
				restaurant_id: restaurantId,
				party_size: opts.partySize,
				quantity: opts.quantity,
				time: currentTime
			})
			currentTime = this.timeUtil.advanceTime15Min(currentTime)
		}
		return await Inventory.bulkCreate(toInsert)
	}

	public async deleteAllInventory() {
		await Inventory.sequelize?.query('TRUNCATE TABLE inventory;')
	}
}

class InventoryOptions {
	restaurantName: string
	partySize: number
	quantity: number
	time: number	// Time is (hour in 24 hr format x 100 plus minutes, for example, 1:15pm would be 1315),
	startTime: number
	stopTime: number
}