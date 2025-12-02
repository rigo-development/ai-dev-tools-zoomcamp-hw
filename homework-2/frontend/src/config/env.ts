import * as v from 'valibot'

const envSchema = v.object({
    VITE_BACKEND_URL: v.pipe(v.string(), v.url()),
    MODE: v.pipe(v.string())
})

function validateEnv() {
    try {
        return v.parse(envSchema, {
            VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
            MODE: import.meta.env.MODE
        })
    } catch (error) {
        console.error('Environment validation failed:', error)
        throw new Error('Invalid environment configuration. Please check your .env file.')
    }
}

export const env = validateEnv()
