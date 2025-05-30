import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    // Handle admin credentials
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });

                    const data = await res.json();
                    

                    if (data.success) {
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.name,
                            role: data.user.role,
                            token: data.token
                        };
                    }

                    return null;
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log('JWT Callback - User data:', user);
            console.log('JWT Callback - Current token:', token);
            
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.token = user.token;
                if (user.email) token.email = user.email;
            }
            
            console.log('JWT Callback - Final token:', token);
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.id = token.id;
                session.user.token = token.token;
                if (token.email) session.user.email = token.email;
            }
            return session;
        }
    },
    pages: {
        signIn: "/admin",
    },
    session: {
        strategy: "jwt",
    },
}; 