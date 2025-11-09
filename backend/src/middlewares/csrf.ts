import { doubleCsrf } from 'csrf-csrf'
import { doubleCsrfUtilities } from '../config'

const { doubleCsrfProtection: scrfPro } = doubleCsrf(doubleCsrfUtilities)

export { scrfPro }
