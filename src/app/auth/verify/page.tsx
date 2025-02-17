import { Button } from '@/components/ui/button'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function VerifyRequest() {
  const h = await headers()
  const url =
    h
      .get('x-url')
      ?.split('?')[0]
      .match(/^(https?:\/\/[^\/]+)/)?.[1] || ''

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-muted-foreground mb-6">
          A sign in link has been sent to your email address. Click the link to sign in to your
          account.
        </p>
        {url && (
          <div className="mb-4">
            <Button className="font-light" variant="outline" asChild>
              <Link href="/">GO IDEAFLOW</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
