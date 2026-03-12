import { Auth0Client } from '@auth0/nextjs-auth0/server'

/**
 * Single Auth0 client instance — import this in any server context.
 *
 * APP_BASE_URL is set automatically for Vercel preview deployments
 * via next.config.ts. For local dev, set it to http://localhost:3000.
 */
console.log('AUTH0_BASE_URL', process.env.AUTH0_BASE_URL)
console.log('APP_BASE_URL', process.env.APP_BASE_URL)
export const auth0 = new Auth0Client({
  authorizationParameters: {
    appBaseUrl: process.env.AUTH0_BASE_URL, // https://gmtnezschez.com/linky
    // Uncomment and set AUTH0_AUDIENCE in .env.local if you're using
    // Auth0 as an authorization server for your own API.
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email',
  },
})
