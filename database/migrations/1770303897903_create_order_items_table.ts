import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')

      table
        .integer('digital_product_id')
        .unsigned()
        .references('id')
        .inTable('digital_products')
        .onDelete('SET NULL')

      table.string('product_title').notNullable()
      table.decimal('price', 12, 2).notNullable()
      table.integer('quantity').unsigned().notNullable().defaultTo(1)
      table.text('download_url').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}