import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/signup')({
    component: Signup,
})

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.navigate({ to: '/login' })
                }, 2000)
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
            <Card className="w-full max-w-md border-4 border-[var(--sign-blue)] shadow-[8px_8px_0px_var(--sign-blue)]">
                <CardHeader className="text-center border-b-4 border-[var(--sign-blue)] bg-[var(--sign-blue)] text-black">
                    <CardTitle className="text-4xl uppercase tracking-widest">New Member</CardTitle>
                    <CardDescription className="text-black/70 font-mono font-bold">NEW ACCOUNTS REQUIRE EMAIL VERIFICATION</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">✨</div>
                            <h3 className="text-2xl font-bold uppercase mb-2">Registration Complete</h3>
                            <p className="text-[var(--ink-black)] mt-2 font-mono">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="font-bold uppercase tracking-wider">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password" className="font-bold uppercase tracking-wider">Create Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            {error && (
                                <div className="p-4 border-2 border-[var(--sign-red)] bg-[var(--sign-red)]/10 text-[var(--sign-red)] font-bold text-center uppercase text-sm">
                                    ⚠ {error}
                                </div>
                            )}
                            <Button type="submit" disabled={loading} className="w-full text-lg h-14 mt-4" variant="secondary">
                                {loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
                            </Button>

                            <div className="text-center mt-4">
                                <span className="text-[var(--ink-black)]/60 font-mono text-sm">Already have an account? </span>
                                <Link to="/login" className="text-[var(--sign-red)] font-bold hover:underline decoration-2">
                                    SIGN IN
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
