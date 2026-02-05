import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from './order.js'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

   @column()
  declare orderId: number

  @column()
  declare digitalProductId: number | null

  @column()
  declare productTitle: string

  @column()
  declare price: number

  @column()
  declare downloadUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}