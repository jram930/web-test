import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ReservationLogic } from '../lib/ReservationLogic'
import logger from '../logger';

@Controller('reservations')
export class ReservationController {

	logic: ReservationLogic

	constructor() {
		this.logic = new ReservationLogic()
	}

	@Get('')
	private async getAllReservations(req: Request, res: Response) {
		try {
			const reservations = await this.logic.getAllReservations()
			return res.status(200).send(reservations)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(400)
		}
	}

	@Get(':id')
	private async getReservationById(req: Request, res:Response) {
		try {
			if(this.logic.getReservationByIdCheckValidRequest(req)) {
				const restaurant = await this.logic.getReservationById(req.params.id)
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
	private async createReservation(req: Request, res: Response) {
		try {
			if(!this.logic.postCheckValidRequest(req)) return res.sendStatus(400)

			await this.logic.createReservationIfInventoryAllows(req.body)

			return res.sendStatus(200)
		} catch(error) {
			logger.error(error)
			return res.status(400).send({error})
		}
	}
}