import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('order_code').notNullable().unique()
      table.decimal('total_amount', 12, 2).notNullable()

      table.enum('status', [
        'pending',
        'paid',
        'failed',
        'expired'
      ]).defaultTo('pending')

      table.string('payment_gateway').defaultTo('midtrans')
      table.string('payment_reference').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}