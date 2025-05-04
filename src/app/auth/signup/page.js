// src\app\auth\signup\page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
import { z } from "zod"; 

const signupUserSchema = z.object({
	name: z.string()
		.min(2, 'Name must be at least 2 characters')
		.max(50, 'Name must not exceed 50 characters')
		.regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
	email: z.string().email('Invalid email format'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(
			/^(?=.*[!@#$%^&*(),.?":{|}<>])/,
			'Password must contain at least one special character'
		),
});

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleSignup = async () => {
		try {
			setError(null); // Clear any previous errors
			const userData = { name, email, password };
			const validatedData = signupUserSchema.parse(userData);
			const res = await axios.post("/api/auth/signup", validatedData);

 			router.push('/auth/login');

		} catch (error) {
			if (error instanceof z.ZodError) {
 				setError(error.errors[0].message);
			} else if (axios.isAxiosError(error)) {
 				const errorMessage = error.response?.data?.error || 'Failed to sign up';
				setError(errorMessage);
			} else {
 				setError('An unexpected error occurred');
			}
		}
	};



	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<div className="flex flex-col items-center justify-center w-full flex-1 text-center">
				<div className="flex w-full max-w-md flex-col gap-4">
					<h1 className="text-6xl font-bold">Sign Up</h1>
					<Input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
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
					<Button onClick={handleSignup}>Sign Up</Button>
				</div>
				{error && <p className="text-red-500 mt-4">{error}</p>}

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href="'/auth/login'"
							className="font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors"
						>
							Login here
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-4 w-4"
							>
								<path d="m9 18 6-6-6-6" />
							</svg>
						</Link>
					</p>
				</div>

			</div>
		</div >
	);
}


