"use client"

import { useState } from "react"
import Link from "next/link"
import { ApiClientError } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { IconUserPlus, IconArrowLeft, IconCheck } from "@tabler/icons-react"

export default function RequestAccessPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [relationship, setRelationship] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/guest-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          relationship,
          message: message.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new ApiClientError(
          data?.error?.code || "REQUEST_FAILED",
          data?.error?.message || "Something went wrong. Please try again.",
          res.status,
        )
      }

      setSubmitted(true)
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

  if (submitted) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4">
        <Card className="w-full max-w-sm rounded-2xl border-rose-100/60 shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <IconCheck className="size-7 text-emerald-600" />
            </div>
            <CardTitle className="text-xl">Request Sent!</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your request has been sent. The couple will review it.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
              Back to homepage
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
            <IconUserPlus className="size-6 text-rose-500" />
          </div>
          <CardTitle className="text-xl">Request Access</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ask the couple for guest access
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
                At least 8 characters. You&apos;ll use this to log in after approval.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select
                value={relationship}
                onValueChange={setRelationship}
                required
              >
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message">
                Message{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell the couple why you'd like access…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !relationship}
            >
              {loading ? "Sending…" : "Request Access"}
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
