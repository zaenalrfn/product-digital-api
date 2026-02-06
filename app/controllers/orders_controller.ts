import type { HttpContext } from '@adonisjs/core/http'
// import OrderService from '#services/OrderService'

export default class OrdersController {
    async index({ response }: HttpContext) {
        return response.ok({ message: 'Orders list' })
    }
}