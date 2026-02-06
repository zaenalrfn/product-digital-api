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
import ProdukDigitalsController from '#controllers/produk_digitals_controller'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// route auth
router.group(() => {
  router.post('/register', [AuthController, 'register']).use(throttle)
  router.post('/login', [AuthController, 'login']).use(throttle)
  
  router.group(() => {
    router.post('/logout', [AuthController, 'logout']).use(throttle)
    router.get('/me', [AuthController, 'me'])
  }).use(middleware.auth())
}).prefix('api')


// route produk digital
router.group(() => {
    router.post('/produk-digitals', [ProdukDigitalsController, 'store']).use(throttle)
    router.get('/produk-digitals', [ProdukDigitalsController, 'index'])
    router.get('/produk-digitals/:id', [ProdukDigitalsController, 'show'])
    router.put('/produk-digitals/:id', [ProdukDigitalsController, 'update'])
    router.delete('/produk-digitals/:id', [ProdukDigitalsController, 'destroy'])
}).prefix('api').use(middleware.auth())

// route orders
import OrdersController from '#controllers/orders_controller'
router.group(() => {
    router.get('/orders', [OrdersController, 'index'])
}).prefix('api').use(middleware.auth())

// route checkout
import CheckoutsController from '#controllers/checkouts_controller'
router.group(() => {
    router.post('/checkout', [CheckoutsController, 'store'])
}).prefix('api').use(middleware.auth())

// route midtrans webhook
import MidtransWebhooksController from '#controllers/midtrans_webhooks_controller'
router.post('/midtrans/webhook', [MidtransWebhooksController, 'handle']).prefix('api')
