import { safe } from '@/app/database'
import { createDynamicRoute } from 'asasvirtuais/next-interface'

export const GET = createDynamicRoute(safe)
export const POST = createDynamicRoute(safe)
/** Not used in the app */
// export const PATCH = createDynamicRoute(safe)
// export const DELETE = createDynamicRoute(safe)
