import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
    component: Login,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            redirect: search.redirect as string | undefined,
        }
    },
})

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const search = Route.useSearch()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                // Redirect to the page the user was trying to access, or default to sign-maker
                const redirectUrl = search.redirect || '/sign-maker'
                router.navigate({ to: redirectUrl })
            }
        } catch (err) {
            setError('An unexpected error occurred')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 retro-mode">
            <Card className="w-full max-w-md border-4 border-[var(--ink-black)] shadow-[8px_8px_0px_var(--ink-black)]">
                <CardHeader className="text-center border-b-4 border-[var(--ink-black)] bg-[var(--ink-black)] text-[var(--paper-bg)]">
                    <CardTitle className="text-4xl uppercase tracking-widest text-[var(--paper-bg)]">Sign In</CardTitle>
                    <CardDescription className="text-[var(--paper-bg)]/70 font-mono">AUTHORIZED PERSONNEL ONLY</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="font-bold uppercase tracking-wider">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-[var(--paper-bg)]"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="font-bold uppercase tracking-wider">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-4 border-2 border-[var(--sign-red)] bg-[var(--sign-red)]/10 text-[var(--sign-red)] font-bold text-center uppercase text-sm">
                                ⚠ {error}
                            </div>
                        )}
                        <Button type="submit" disabled={loading} className="w-full text-lg h-14 mt-4">
                            {loading ? 'AUTHENTICATING...' : 'ACCESS ACCOUNT'}
                        </Button>

                        <div className="text-center mt-4">
                            <span className="text-[var(--ink-black)]/60 font-mono text-sm">New here? </span>
                            <Link to="/signup" className="text-[var(--sign-blue)] font-bold hover:underline decoration-2">
                                REGISTER NOW
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
