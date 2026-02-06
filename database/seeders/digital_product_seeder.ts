import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const DigitalProduct = (await import('#models/digital_product')).default

    await DigitalProduct.updateOrCreateMany('slug', [
      {
        title: 'Complete Node.js Guide',
        slug: 'complete-nodejs-guide',
        description: 'Master Node.js from scratch with this comprehensive e-book.',
        price: 150000,
        downloadUrl: 'https://example.com/downloads/nodejs-guide.pdf',
        isActive: true,
      },
      {
        title: 'Advanced React Patterns',
        slug: 'advanced-react-patterns',
        description: 'Level up your React skills with advanced design patterns.',
        price: 250000,
        downloadUrl: 'https://example.com/downloads/react-patterns.zip',
        isActive: true,
      },
      {
        title: 'Laravel 11 for Beginners',
        slug: 'laravel-11-beginners',
        description: 'The best starting point for learning Laravel 11 framework.',
        price: 120000,
        downloadUrl: 'https://example.com/downloads/laravel-11.pdf',
        isActive: true,
      },
      {
        title: 'Modern UI Design System',
        slug: 'modern-ui-design-system',
        description: 'A complete Figma design system for your next project.',
        price: 99000,
        downloadUrl: 'https://example.com/downloads/ui-system.fig',
        isActive: true,
      },
      {
        title: 'Docker Mastery for Developers',
        slug: 'docker-mastery',
        description: 'Containerize your applications like a pro with Docker.',
        price: 300000,
        downloadUrl: 'https://example.com/downloads/docker-mastery.mp4',
        isActive: true,
      },
    ])
  }
}