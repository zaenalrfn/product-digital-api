import mail from '@adonisjs/mail/services/main'

export default class MailService {
    static async sendDownloadLinks(user: { email: string; fullName: string | null }, order: any, items: any[]) {
        await mail.send((messages) => {
            messages
                .from('no-reply@productdigitalstore.com', 'Product Digital Store')
                .to(user.email)
                .subject(`Your Order ${order.orderCode} is Ready!`)
                .htmlView('emails/order_success', {
                    user,
                    order,
                    items
                })
        })
    }
}