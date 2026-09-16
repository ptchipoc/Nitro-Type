import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import FortyTwoSchool from "next-auth/providers/42-school";
import { authConfig } from "./auth.config";
import {
  signInEmail,
  signInProvider,
} from "@/features/auth/queries/auth.query";
import { forwardCookiesToBrowser } from "../api/helpers/forward-cookies.helper";
import { ApiRequestError } from "../api/errors";
import {
  EmailNotVerifiedError,
  InvalidCredentialsError,
} from "./credentials-errors";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { cookies } from "next/dist/server/request/cookies";

const PROVIDER_MAP = {
  google: "google",
  github: "github",
  "42-school": "42-school",
};

type OAuthProfile = {
  picture?: string;
  avatar_url?: string;
  image?: {
    link?: string;
  };
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FortyTwoSchool({
      clientId: process.env.INTRA_CLIENT_ID,
      clientSecret: process.env.INTRA_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _request): Promise<User | null> {
        const email =
          typeof credentials?.email === "string" ? credentials.email : null;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) return null;

        try {
          const res = await signInEmail({
            email,
            password,
          });

          if (res.success && res.data) {
            await forwardCookiesToBrowser(res._rawHeaders);

            return {
              id: res.data.user.id.toString(),
              name: res.data.user.name,
              email: res.data.user.email,
              role: res.data.user.role,
              status: res.data.user.status,
              avatarUrl: res.data.user.avatarUrl,
            };
          }

          return null;
        } catch (error) {
          if (error instanceof ApiRequestError) {
            if (error.status === 403) {
              throw new EmailNotVerifiedError();
            }

            if (error.status === 401) {
              throw new InvalidCredentialsError();
            }
          }

          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // credentials já tratado no authorize — deixa passar
      if (account?.type === "credentials") return true;
      // console.log("Account:", account);

      if (!account?.provider) return false;
      const providerName =
        PROVIDER_MAP[account.provider as keyof typeof PROVIDER_MAP];
      if (!providerName) return false;

      // console.log("Provider Profile:", profile);
      const oauthProfile = (profile ?? {}) as OAuthProfile;
      const avatarUrl =
        user.avatarUrl ??
        oauthProfile.picture ??
        oauthProfile.avatar_url ??
        oauthProfile.image?.link ??
        null;

      try {
        const res = await signInProvider({
          provider:
            providerName.toLowerCase() == "42-school"
              ? "intra42"
              : providerName,
          providerId: account.providerAccountId,
          name: user.name ?? "",
          email: user.email ?? "",
          emailVerified: true,
          avatarUrl: avatarUrl ?? undefined,
        });
        if (!res.success || !res.data) {
          return false;
        }

        await forwardCookiesToBrowser(res._rawHeaders);
        user.id = res.data.user.id.toString();
        user.role = res.data.user.role;
        user.status = res.data.user.status;
        user.avatarUrl = res.data.user.avatarUrl;

        return true;
      } catch (error) {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.avatarUrl =
          typeof token.avatarUrl === "string" ? token.avatarUrl : undefined;
      }
      return session;
    },
  },
  events: {
    async signIn() {
      return;
    },
    async signOut() {
      try {
        const res = await logoutAction();
         const cookieStore = await cookies();
        // Limpa todos os cookies
        for (const cookie of cookieStore.getAll()) {
          cookieStore.delete(cookie.name);
        }
        console.log("Logout successful on API: ", res);

      } catch (error) {
        console.error("Erro ao fazer logout na API:", error);
      }
      return;
    }
  },
  logger: {
    debug: () => false,
    info: () => false,
    warn: () => false,
    error: () => false,
  },
});
