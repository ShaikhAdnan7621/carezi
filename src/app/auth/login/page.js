'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Login({ searchParams }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false); // For login submission
	const [refreshing, setRefreshing] = useState(false); // For token refresh
	const router = useRouter();

	const redirect = searchParams?.redirect || '/';
	const refresh = searchParams?.refresh === 'true';

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // Start login loading
		try {
			const res = await axios.post('/api/auth/login', {
				email,
				password,
			});
			console.log("Response from backend: ", res);
			if (res.status === 200) {
				window.location.href = redirect;
			}
		} catch (error) {
			console.error('Login failed:', error?.response?.data?.error || error.message);
			setLoading(false); // Stop loading if failed
		}
		setEmail('');
		setPassword('');
	};

	useEffect(() => {
		const refreshAccessToken = async () => {
			setRefreshing(true); // Start token refresh loading
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
			} finally {
				setRefreshing(false); // Stop token refresh loading
			}
		};
		if (refresh) {
			refreshAccessToken();
		}
	}, [refresh, redirect, router, searchParams]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<div className="flex flex-col items-center justify-center w-full flex-1 text-center">
				{refreshing ? (
					// Show a loading animation during token refresh
					<div className="flex items-center justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4">
						<h1 className="text-6xl font-bold">Log In</h1>
						<Input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
						/>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<div className="flex items-center gap-2">
									<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
									Logging in...
								</div>
							) : (
								'Log In'
							)}
						</Button>
					</form>
				)}
				<div className="mt-4 flex w-full justify-center">
					<p className="text-center">
						{`Don't have an account? `}<Link href="/auth/signup">Sign Up</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
