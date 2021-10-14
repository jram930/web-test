import { Restaurant } from "../models"

export class RestaurantLookup {
	public async getRestuarantId(name: string) {
		const restaurant = await Restaurant.findOne({ where: { name } })
		let id = null
		if (restaurant && restaurant.id) {
			id = restaurant.id
		}
		return id
	}
}