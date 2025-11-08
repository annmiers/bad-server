import { NextFunction, Request, Response } from 'express'
import { sanitizeHTMLInput } from '../utils/sanitizeHTML' // Убедитесь, что путь к файлу верный

const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
        return sanitizeHTMLInput(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    } else if (obj !== null && typeof obj === 'object') {
        const sanitizedObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitizedObj[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitizedObj;
    }
    return obj;
};

export function sanitizeBody(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
}
