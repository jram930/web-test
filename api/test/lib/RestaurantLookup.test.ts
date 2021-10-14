import {RestaurantLookup} from '../../src/lib/RestaurantLookup'

describe('RestaurantLookup', () => {

	test('getRestaurantId', async () => {

		let passedQueryParams = null
		let expectedRestaurant = {
			name: 'fakeRestaurant',
			id: 42
		}
		const _model = {
			findOne: async (params) => {
				passedQueryParams = params
				return expectedRestaurant
			}
		}

		const target = new RestaurantLookup({_model})
		const actualId = await target.getRestuarantId('fakeRestaurant')
		expect(actualId).toBe(expectedRestaurant.id)
	});

})