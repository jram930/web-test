import { Controller, Get, Post, Delete } from '@overnightjs/core'
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
	private async getAllInventories(req: Request, res: Response) {
		try {
			const inventories = await this.logic.getAllInventories()
			return res.status(200).send(inventories)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(400)
		}
	}

	@Get(':id')
	private async getInventoryById(req: Request, res:Response) {
		try {
			if(this.logic.getInventoryByIdCheckValidRequest(req)) {
				const restaurant = await this.logic.getInventoryById(req.params.id)
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
	private async createInventory(req: Request, res: Response) {
		try {
			if(!this.logic.createInventoryCheckValidRequest(req)) return res.sendStatus(400)

			await this.logic.createInventory(req.body)

			return res.sendStatus(201)
		} catch(error) {
			logger.error(error)
			return res.status(400).send({error})
		}
	}

	@Delete('')
	private async deleteAllInventory(req: Request, res: Response) {
		try {
			await this.logic.deleteAllInventory()
			return res.sendStatus(200)
		} catch(err) {
			logger.error(err)
			return res.sendStatus(400)
		}
	}
}