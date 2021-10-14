import { Controller, Get, Post, Delete } from '@overnightjs/core'
import { Request, Response } from 'express'
import { RestaurantLogic } from '../lib/RestaurantLogic';
import logger from '../logger';

@Controller('restaurants')
export class RestaurantController {

	logic: RestaurantLogic

	constructor() {
		this.logic = new RestaurantLogic()
	}

	@Get('')
	private async getAllRestaurants(req: Request, res: Response) {
		try {
			const restaurants = await this.logic.getAllRestaurants()
			return res.status(200).send(restaurants)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(400)
		}
	}

	@Get(':id')
	private async getRestaurantById(req: Request, res:Response) {
		try {
			if(this.logic.getRestaurantByIdCheckValidRequest(req)) {
				const restaurant = await this.logic.getRestaurantById(req.params.id)
				return res.status(200).send(restaurant)
			} else {
				return res.sendStatus(400)
			}
		} catch(err) {
			logger.error(err)
			return res.sendStatus(400)
		}
	}

	@Post('')
	private async createRestaurant(req: Request, res: Response) {
		try {
			if(!this.logic.postCheckValidRequest(req)) return res.sendStatus(400)

			await this.logic.createRestaurant(req.body)

			return res.sendStatus(201)
		} catch(error) {
			logger.error(error)
			return res.status(400).send({error})
		}
	}

	@Delete('')
	private async deleteAllRestaurants(req: Request, res: Response) {
		try {
			await this.logic.deleteAllRestaurants()
			return res.sendStatus(200);
		} catch(err) {
			logger.error(err)
			return res.sendStatus(400)
		}
	}
}