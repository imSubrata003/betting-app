'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useAppContext } from '@/components/context/Appcontext'
import { useRouter } from 'next/navigation'

const AuthPage = () => {
    const [phone, setPhone] = useState('')
    const [pass, setPass] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSignup, setIsSignup] = useState(false)
    const { userData, setUserData } = useAppContext();
    const router = useRouter()

    const userSignup = async (phone: string, pass: string, name: string) => {
        try {
            const res = await axios.post('/api/user/signup', {
                name, phone, pass
            });
            //console.log("Signup response:", res.data);
        } catch (error: any) {
            console.error("Signup error:", error?.response?.data || error.message);
            throw error;
        }
    };


    const userLogin = async (phone: string, pass: string) => {
        try {
            const res = await axios.post('/api/user/login', {
                phone, pass
            });

            setUserData(res.data);
            localStorage.setItem('userData', JSON.stringify(res.data)); 
            router.push('/');
        } catch (error) {
            //console.log(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isSignup) {
                await userSignup(phone, pass, name)
            } else {
                await userLogin(phone, pass)
            }
        } catch (err) {
            setError('Something went wrong. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-black">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isSignup ? 'Create an Account' : 'Login'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignup && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {isSignup ? 'Login' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
