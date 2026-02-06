import midtransClient from 'midtrans-client';
import env from '#start/env';
import crypto from 'node:crypto';

export default class MidtransService {
    private static snap = new midtransClient.Snap({
        isProduction: env.get('MIDTRANS_IS_PRODUCTION') === 'true',
        serverKey: env.get('MIDTRANS_SERVER_KEY') ?? '',
        clientKey: env.get('MIDTRANS_CLIENT_KEY') ?? ''
    })

    private static core = new midtransClient.CoreApi({
        isProduction: env.get('MIDTRANS_IS_PRODUCTION') === 'true',
        serverKey: env.get('MIDTRANS_SERVER_KEY')!,
        clientKey: env.get('MIDTRANS_CLIENT_KEY')!,
    })
    
    /**
     * Create Snap Transaction
     * @param params Transaction parameters
     * @returns Promise<{ token: string, redirect_url: string }>
     */
    static async createTransaction(params: any): Promise<{ token: string, redirect_url: string }> {
        try {
            const transaction = await this.snap.createTransaction(params);
            return transaction;
        } catch (error) {
            console.error('Midtrans Create Transaction Error:', error);
            throw error;
        }
    }

    /**
     * Validate Signature Key
     * @param orderId Order ID from notification
     * @param statusCode Status code from notification
     * @param grossAmount Gross amount from notification
     * @param signatureKey Signature key from notification
     * @returns boolean
     */
    static validateSignatureKey(orderId: string, statusCode: string, grossAmount: string, signatureKey: string): boolean {
        const serverKey = env.get('MIDTRANS_SERVER_KEY');
        const input = orderId + statusCode + grossAmount + serverKey;
        const signature = crypto.createHash('sha512').update(input).digest('hex');
        return signature === signatureKey;
    }

    /**
     * Verify Payment Notification
     * @param notificationBody The JSON body received from Midtrans webhook
     * @returns Promise<any> The verified status response
     */
    static async verifyNotification(notificationBody: any): Promise<any> {
        try {
            const core = this.core as any
            const statusResponse = await core.transaction.notification(notificationBody)
            
            const isValid = this.validateSignatureKey(
                statusResponse.order_id,
                statusResponse.status_code,
                statusResponse.gross_amount,
                statusResponse.signature_key
            );

            if (!isValid) {
                throw new Error('Invalid Signature Key');
            }

            return statusResponse;
        } catch (error) {
            console.error('Midtrans Verify Notification Error:', error);
            throw error;
        }
    }
}