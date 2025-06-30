import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

// In a real application, this would be a database call
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@aurave.com',
    password: '$2b$10$8OxDlUjXBBTK4QFcIfYUXeP0fGPkaVwXqT9HOXhbRv.M5VpVK.Rvu', // hashed 'admin123'
    role: 'admin'
  },
  {
    id: '2',
    name: 'Customer User',
    email: 'user@example.com',
    password: '$2b$10$8OxDlUjXBBTK4QFcIfYUXeP0fGPkaVwXqT9HOXhbRv.M5VpVK.Rvu', // hashed 'admin123'
    role: 'user'
  }
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = mockUsers.find(user => user.email === credentials.email);
        
        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = (user as any).role;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      (session.user as any).role = token.role;
    }
    return session;
  }
},
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
});

export { handler as GET, handler as POST };