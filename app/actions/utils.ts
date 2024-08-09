import { jwtVerify } from 'jose';

export function parseJwt(token: string | undefined) {
    if (!token || token === undefined || token.split('.').length<2 ) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = Buffer.from(base64, 'base64').toString('utf-8');
    console.log(JSON.parse(decodedData));
    return JSON.parse(decodedData);
}

export async function validate(token: string | undefined) {
    if (!token || token === undefined) { return; }
    try {
        const secret = new TextEncoder().encode(process.env.Secret_Key);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (err) {
        console.error('Token verification failed: ', err);
        return;
    }
}

export function convertUTCToIST(date: Date): Date {
    // Calculate the IST offset in milliseconds (5 hours 30 minutes)
    const istOffset: number = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
  
    // Get the UTC time in milliseconds
    const utcTime: number = date.getTime();
  
    // Calculate the IST time by adding the offset
    const istTime: Date = new Date(utcTime + istOffset);
  
    return istTime;
  }



