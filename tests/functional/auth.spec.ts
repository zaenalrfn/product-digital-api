import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('register user', async ({ client }) => {
    const response = await client.post('/api/register').json({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      fullName: 'Test User',
      email: 'test@example.com',
    })
  })

  test('login user', async ({ client }) => {
    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.post('/api/login').json({
      email: 'test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      type: 'bearer',
    })
  })

  test('get me', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })
    const token = await User.accessTokens.create(user)

    const response = await client.get('/api/me').bearerToken(token.value!.release())

    response.assertStatus(200)
    response.assertBodyContains({
      email: 'test@example.com',
    })
  })

  test('logout user', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })
    const token = await User.accessTokens.create(user)

    const response = await client.post('/api/logout').bearerToken(token.value!.release())

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Logged out successfully',
    })
  })
})
