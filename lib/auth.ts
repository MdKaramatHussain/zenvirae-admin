import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRE = '1h'

export interface JwtPayload {
  id: string
  email: string
  role: string
}

/**
 * Generate JWT Token
 */
export const generateToken = (payload: JwtPayload): string => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    })
    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Failed to generate authentication token')
  }
}

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    }
    throw error
  }
}

/**
 * Decode JWT Token without verification (for client-side use)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any
    if (!decoded || !decoded.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}
