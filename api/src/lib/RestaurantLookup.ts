import { Restaurant } from "../models"

export class RestaurantLookup {

	model

	constructor(opts = {_model: undefined}) {
		const {_model} = opts;
		this.model = _model ?? Restaurant
	}

	public async getRestuarantId(name: string) {
		const restaurant = await this.model.findOne({ where: { name } })
		let id = null
		if (restaurant && restaurant.id) {
			id = restaurant.id
		}
		return id
	}
}