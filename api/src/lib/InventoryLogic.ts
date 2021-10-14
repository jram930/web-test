import { Inventory } from '../models'
import { Restaurant } from '../models';
import { Request } from 'express'

export class InventoryLogic {

	public postCheckValidRequest(req: Request) {
		if(!req || !req.body) return false
		const {
			restaurantName,
			partySize,
			quantity,
			time
		} = req.body;
		if(!restaurantName || !partySize || !quantity || time === undefined) return false
		return true
	}

	public async getAllInventories() {
		return await Inventory.findAll();
	}

	public async createInventory(opts: InventoryOptions) {
		const restaurantId = await this.getRestuarantId(opts.restaurantName)
		if(restaurantId) {
			await Inventory.create({
				restaurant_id: restaurantId,
				party_size: opts.partySize,
				quantity: opts.quantity,
				time: opts.time
			});
		} else {
			throw 'Invalid restuarant'
		}
		return;
	}

	private async getRestuarantId(name: string) {
		const restaurant = await Restaurant.findOne({where: {name}})
		let id = null;
		if(restaurant && restaurant.id) {
			id = restaurant.id
		}
		return id
	}
}

class InventoryOptions {
	restaurantName: string
	partySize: number
	quantity: number
	time: number	// Time is (hour in 24 hr format x 100 plus minutes, for example, 1:15pm would be 1315)
}