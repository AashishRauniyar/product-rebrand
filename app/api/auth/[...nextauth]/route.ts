import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Auth: Starting authentication process");
        
        if (!credentials?.username || !credentials?.password) {
          console.log("Auth: Missing credentials");
          return null;
        }

        try {
          console.log("Auth: Attempting to authenticate user:", credentials.username);

          // Get user from database
          const [users] = await pool.query<User[]>(
            "SELECT * FROM users WHERE username = ?",
            [credentials.username]
          );

          console.log("Auth: Query result:", {
            found: users.length > 0,
            userCount: users.length
          });

          const user = users[0];

          if (!user) {
            console.log("Auth: User not found");
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Auth: Password verification result:", isValid);

          if (!isValid) {
            console.log("Auth: Invalid password");
            return null;
          }

          console.log("Auth: Authentication successful");
          return {
            id: user.id.toString(),
            name: user.username || "", // Ensure name is never undefined
          };
        } catch (error: any) {
          console.error("Auth: Error during authentication:", error);
          console.error("Auth: Error details:", {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
          });
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
    maxAge: 30 * 60, // 30 minutes in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("Auth: JWT Callback", { token, user });
      if (user) {
        token.id = user.id;
        token.name = user.name || ""; // Ensure name is never undefined
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Auth: Session Callback", { session, token });
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
        };
      }
      return session;
    },
  },
  debug: true, // Enable debug mode
});

export { handler as GET, handler as POST };
