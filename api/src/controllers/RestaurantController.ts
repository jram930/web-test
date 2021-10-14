import { Controller, Get, Post } from '@overnightjs/core'
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
	private async get(req: Request, res: Response) {
		try {
			const restaurants = await this.logic.getAllRestaurants()
			return res.status(200).send(restaurants)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(500)
		}
	}

	@Post('')
	private async post(req: Request, res: Response) {
		try {
			if(!this.logic.postCheckValidRequest(req)) return res.sendStatus(400)

			await this.logic.createRestaurant(req.body)

			return res.sendStatus(200)
		} catch(error) {
			logger.error(error)
			return res.status(400).send({error})
		}
	}
}