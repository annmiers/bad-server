import { NextFunction, Request, Response } from 'express'
import sanitizeHtml from 'sanitize-html'

export function sanitizeBody(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const sanitized = Object.entries(req.body ?? {}).reduce<
        Record<string, any>
    >((acc, [key, value]) => {
        acc[key] =
            typeof value === 'string'
                ? sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                        disallowedTagsMode: 'discard',
                    })
                : value
        return acc
    }, {})

    req.body = sanitized
    next()
}
