import type { HttpContext } from '@adonisjs/core/http'
import OrderService from '#services/OrderService'

export default class MidtransWebhooksController {
    async handle({ request, response }: HttpContext) {
        const notificationBody = request.body();
        
        try {
            await OrderService.handlePaymentNotification(notificationBody);
            return response.ok({ message: 'Notification processed' }); // Midtrans expects 200 OK
        } catch (error) {
            console.error('Webhook Error:', error);
            // Even if we fail processing, we might want to return 200 to Midtrans to stop retries if it's a logic error, 
            // but 500 if it's a temporary issue. For now return 500 on error.
            return response.internalServerError({ message: 'Failed to process notification' });
        }
    }
}