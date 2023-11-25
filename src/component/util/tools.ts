import Crypto from 'crypto';
import base64url from 'base64url';

export const encrypt = (data: string) => {
    const secret = process.env.SECRET_KEY || ''

    const encodedSecret = Buffer.from(secret).toString('base64');
    const generatedFulfilment = Crypto.createHmac('sha256', Buffer.from(encodedSecret, 'ascii')).update(Buffer.from(data, 'ascii')).digest('base64');
    return base64url.fromBase64(generatedFulfilment);
}