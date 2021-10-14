import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { InventoryLogic } from '../lib/InventoryLogic';
import logger from '../logger';

@Controller('inventory')
export class InventoryController {

	logic: InventoryLogic

	constructor() {
		this.logic = new InventoryLogic()
	}

	@Get('')
	private async get(req: Request, res: Response) {
		try {
			const inventories = await this.logic.getAllInventories()
			return res.status(200).send(inventories)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(500)
		}
	}

	@Post('')
	private async post(req: Request, res: Response) {
		try {
			if(!this.logic.postCheckValidRequest(req)) return res.sendStatus(400)

			await this.logic.createInventory(req.body)

			return res.sendStatus(200)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(500)
		}
	}
}