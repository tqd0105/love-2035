"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ApiClientError } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { IconHeart, IconArrowLeft, IconCheck } from "@tabler/icons-react"

export default function InvitePage() {
  const params = useParams<{ token: string }>()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/invite/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: params.token,
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new ApiClientError(
          data?.error?.code || "REDEEM_FAILED",
          data?.error?.message || "Something went wrong. Please try again.",
          res.status,
        )
      }

      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4">
        <Card className="w-full max-w-sm rounded-2xl border-rose-100/60 shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <IconCheck className="size-7 text-emerald-600" />
            </div>
            <CardTitle className="text-xl">Welcome!</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your guest account has been created. You can now browse the
              gallery and shared memories.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
              Go to homepage
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4">
      <Card className="w-full max-w-sm rounded-2xl border-rose-100/60 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-rose-100">
            <IconHeart className="size-6 text-rose-500" />
          </div>
          <CardTitle className="text-xl">You&apos;re Invited!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your details to create a guest account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                At least 8 characters
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Accept Invitation"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
              Back to homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
