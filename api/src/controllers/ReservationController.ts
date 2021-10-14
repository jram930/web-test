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
	private async get(req: Request, res: Response) {
		try {
			const reservations = await this.logic.getAllReservations()
			return res.status(200).send(reservations)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(500)
		}
	}

	@Post('')
	private async post(req: Request, res: Response) {
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