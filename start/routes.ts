/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.post('/register', [AuthController, 'register']).use(throttle)
  router.post('/login', [AuthController, 'login']).use(throttle)
  
  router.group(() => {
    router.post('/logout', [AuthController, 'logout']).use(throttle)
    router.get('/me', [AuthController, 'me'])
  }).use(middleware.auth())
}).prefix('api')
