import Order from '#models/order'
import OrderItem from '#models/order_item'
import User from '#models/user'
import MidtransService from '#services/MidtransService'
import MailService from '#services/MailService'
import string from '@adonisjs/core/helpers/string'

export default class OrderService {
    /**
     * Create a new order and generate Midtrans Snap Token
     */
    static async createOrder(user: User, items: any[]) {
        const DigitalProduct = (await import('#models/digital_product')).default;
        
        // Calculate Total Amount & Prepare Items
        let totalAmount = 0;
        const verifiedItems = [];

        for (const item of items) {
            const product = await DigitalProduct.find(item.productId);
            
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            // Use price and title from Database, NOT from request
            const price = product.price;
            const quantity = item.quantity;
            
            totalAmount += price * quantity;
            
            verifiedItems.push({
                productId: product.id,
                price: price,
                quantity: quantity,
                title: product.title,
                downloadUrl: product.downloadUrl,
                originalItem: item
            });
        }

        // Create Order Record
        const order = new Order();
        order.userId = user.id;
        order.orderCode = `ORD-${string.random(10).toUpperCase()}`; 
        order.totalAmount = totalAmount;
        order.status = 'pending';
        order.paymentGateway = 'midtrans';
        
        await order.save();

        // Create Order Items
        for (const item of verifiedItems) {
            const orderItem = new OrderItem();
            orderItem.orderId = order.id;
            orderItem.digitalProductId = item.productId;
            orderItem.price = item.price;
            orderItem.quantity = item.quantity;
            orderItem.downloadUrl = item.downloadUrl;
            orderItem.productTitle = item.title;
            await orderItem.save();
        }

        // Create Midtrans Transaction
        const transactionParams = {
            transaction_details: {
                order_id: order.orderCode,
                gross_amount: order.totalAmount,
            },
            customer_details: {
                first_name: user.fullName,
                email: user.email,
            },
            item_details: verifiedItems.map(item => ({
                id: item.productId,
                price: item.price,
                quantity: item.quantity,
                name: item.title,
            }))
        };

        const midtransResponse = await MidtransService.createTransaction(transactionParams);

        // Update Order with Snap Token
        order.paymentReference = midtransResponse.token;
        await order.save();

        return {
            order,
            midtrans: midtransResponse
        };
    }

    /**
     * Handle incoming Midtrans Webhook
     */
    static async handlePaymentNotification(notificationBody: any) {
        // Verify Notification
        const statusResponse = await MidtransService.verifyNotification(notificationBody);
        const orderCode = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        // Find Order
        const order = await Order.findBy('orderCode', orderCode);
        if (!order) {
            throw new Error('Order not found');
        }

        // Idempotency Check: If order is already paid or failed, ignore updates
        // Unless it's a specific case where we want to allow updates (e.g. pending -> paid)
        if (order.status === 'paid' || order.status === 'failed' || order.status === 'expired') {
            return order; // Already processed
        }

        // Update Status Logic
        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                order.status = 'pending';
            } else if (fraudStatus == 'accept') {
                order.status = 'paid';
                // Fetch User and Items for Email
                await order.load('user');
                await order.load('items');
                await MailService.sendDownloadLinks(order.user, order, order.items);
            }
        } else if (transactionStatus == 'settlement') {
            order.status = 'paid';
             // Fetch User and Items for Email
            await order.load('user');
            await order.load('items');
            await MailService.sendDownloadLinks(order.user, order, order.items);
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            order.status = 'failed';
        } else if (transactionStatus == 'pending') {
            order.status = 'pending';
        }

        await order.save();
        return order;
    }
}
