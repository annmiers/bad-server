import sanitizeHtml from 'sanitize-html'

export const sanitizeHTMLInput = (input: string): string =>
    sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
    }
)
