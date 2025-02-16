import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { EmailConfig } from "next-auth/providers/email"
import { Resend } from 'resend'
import 'server-only'

const resend = new Resend(process.env.RESEND_API_KEY)

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'resend',
      type: 'email',
      from: process.env.RESEND_RECIPIENT,
      async sendVerificationRequest({ identifier, url, provider }: { identifier: string; url: string; provider: { from: string } }) {
        const { host } = new URL(url)
        try {
          await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: 'Magic sign in link for ideaflow 🚀',
            html: html({ url, host }),
            text: text({ url, host }),
          })
        } catch (error) {
          console.error({ error })
        }
      },
    } as unknown as EmailConfig,
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
  },
})

function html({ url, host }: { url: string; host: string }) {
  const escapedHost = host.replace(/\./g, '&#8203;.')
  return `
<body>
  <header>
    <h1>Use this link to join ideaflow</h1>
  </header>
  <section>
    <p>Sign in to <strong>${escapedHost}</strong></p>
    <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #0f0; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #0f0; display: inline-block; font-weight: bold;">Sign in</a>
  </section>
  <footer>
    <p>If you did not request this email you can safely ignore it.</p>
  </footer>
</body>
`
}

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
