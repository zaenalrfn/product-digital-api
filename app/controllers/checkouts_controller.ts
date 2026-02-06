import type { HttpContext } from '@adonisjs/core/http'
import OrderService from '#services/OrderService'

export default class CheckoutsController {
    async store({ request, response, auth }: HttpContext) {
        const user = auth.user!;
        const items = request.input('items'); // Expecting [{ productId: 1, quantity: 2, price: 10000, title: 'Item 1' }]

        // Basic validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return response.badRequest({ message: 'Items are required' });
        }

        try {
            const result = await OrderService.createOrder(user, items);
            return response.created({
                message: 'Checkout successful',
                data: result
            });
        } catch (error) {
            console.error(error);
            return response.internalServerError({ message: 'Failed to process checkout' });
        }
    }
}