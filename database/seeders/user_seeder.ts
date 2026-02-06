import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const User = (await import('#models/user')).default
    
    await User.updateOrCreate(
      { email: 'zaenal@example.com' },
      {
        email: 'zaenal@example.com',
        fullName: 'Zaenal Abidin',
        password: 'password123',
      }
    )
  }
}