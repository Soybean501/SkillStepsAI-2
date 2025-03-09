import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Use mock user in testing mode
        if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true') {
          return {
            id: 'test-user-id',
            email: credentials?.email || 'test@example.com',
            name: 'Test User',
          }
        }

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // In production mode, we'll handle this in the API route
        // This prevents bcrypt from being included in the client bundle
        const response = await fetch('/api/auth/verify-credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!response.ok) {
          return null
        }

        const user = await response.json()
        return user
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
} 