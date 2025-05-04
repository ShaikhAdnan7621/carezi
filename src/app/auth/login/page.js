// src\app\auth\login\page.js

'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams.get('redirect') || '/';
	const refresh = searchParams.get('refresh') === 'true';
	console.log("Redirect value is :", redirect)

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post('/api/auth/login', {
				email,
				password,
			});
			console.log("Response from backend: ", res)
			if (res.status === 200) {
				window.location.href = redirect;
			}
		} catch (error) {
			console.error('Login failed:', error?.response?.data?.error || error.message);
		}
		setEmail('');
		setPassword('');
	};

	useEffect(() => {
		const refreshAccessToken = async () => {
			try {
				const res = await axios.post('/api/auth/refreshtoken', {}, { withCredentials: true });
				if (res.status === 200) {
					const newSearchParams = new URLSearchParams(searchParams);
					newSearchParams.delete('refresh');
					const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`
					router.replace(newUrl);
					window.location.href = redirect;
				}
			} catch (error) {
				if (error.response && error.response.status === 404) {
					const newSearchParams = new URLSearchParams(searchParams);
					newSearchParams.delete('refresh');
					const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`
					router.replace(newUrl);
					window.location.href = '/auth/login';
				}
				console.error('Failed to refresh token:', error?.response?.data?.error || error.message);
			} 

		};
		if (refresh) {
			refreshAccessToken();
		}
	}, [refresh, redirect, router, searchParams]);


	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<div className="flex flex-col items-center justify-center w-full flex-1 text-center">
				<form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4">
					<h1 className="text-6xl font-bold">Log In</h1>
					<Input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button type="submit"
						disabled={refresh}
					>
						{refresh ? 'Please wait...' : 'Log In'}
					</Button>
				</form>
				<div className="mt-4 flex w-full justify-center">
					<p className="text-center">Don't have an account? <Link href="/auth/signup">Sign Up</Link></p>
				</div>
			</div>
		</div>
	);
}