import { Restaurant } from '../models'
import { Request } from 'express'

export class RestaurantLogic {

	public postCheckValidRequest(req: Request) {
		if(!req || !req.body) return false
		const {
			name,
			address
		} = req.body;
		if(!name || !address) return false
		return true
	}

	public getRestaurantByIdCheckValidRequest(req: Request) {
		if(!req || !req.params || !req.params.id) return false
		return true
	}

	public async getAllRestaurants() {
		return await Restaurant.findAll()
	}

	public async getRestaurantById(id) {
		return await Restaurant.findOne({where: {id}})
	}

	public async createRestaurant(opts: RestaurantOptions) {
		await Restaurant.create({
			name: opts.name,
			address: opts.address
		});
		return;
	}

	public async deleteAllRestaurants() {
		await Restaurant.sequelize?.query('TRUNCATE TABLE restaurant;')
	}
}

class RestaurantOptions {
	name: string
	address: string
}