import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { neon, Pool } from "@neondatabase/serverless";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import "next-auth/jwt";

// Extend the built-in session types
interface ExtendedUser extends NextAuthUser {
  username: string;
  image: string;
  password: string;
  userid: number;
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      username: string;
      image: string;
      userid: number;
    } & DefaultSession["user"];
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    image?: string;
    userid?: number;
  }
}

// Ensure that `authorize` returns `ExtendedUser | null`
export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: PostgresAdapter(pool),
    trustHost: true,
    providers: [
      GitHub,
      Google,
      CredentialsProvider({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;

          try {
            const user = await login(credentials as LoginCredentials);
            if (user) {
              return user as ExtendedUser; // Ensure we return ExtendedUser
            }
            return null;
          } catch (error) {
            if (error instanceof Error) {
              // console.log("Authentication error:", error.message);
            } else {
              // console.log("Unexpected error:", error);
            }
            return null;
          }
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.username = (user as ExtendedUser).username;
          token.image = (user as ExtendedUser).image;
          token.userid = (user as ExtendedUser).userid
        }
        // console.log("JWT token:", token);
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.username = token.username || "";
          session.user.image = token.image || "";
          session.user.userid = token.userid || 0;
        }
        // console.log("Session:", session);
        return session;
      },
    },
  };
});

// Define LoginCredentials for typing
interface LoginCredentials {
  email: string;
  password: string;
}

// Modify `login` to return `ExtendedUser | null`
async function login(credentials: LoginCredentials): Promise<ExtendedUser | null> {
  const { email, password } = credentials;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const user = await sql`
      SELECT * FROM users 
      WHERE email = ${email} 
      AND authType = 'credentials'
      LIMIT 1
    `;

    if (user.length === 0) {
      throw new Error("User not found");
    }

    const isValid = await compare(password, user[0].password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Return the user as `ExtendedUser`
    return user[0] as ExtendedUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Authentication error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
}