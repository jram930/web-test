import { Inventory } from "../models"

export class InventoryLookup {
	public async getInventoryForRestaurantAtTimeForPartySize(restaurantId: number, opts) {
		return await Inventory.findOne({ where: { restaurant_id: restaurantId, time: opts.time, party_size: opts.partySize } })
	}
}