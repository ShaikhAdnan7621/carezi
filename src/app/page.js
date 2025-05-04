'use client'
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Editor from "@/components/Editor";

export default function Home() {
 

	return (
		<div className=" font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-bold">Carezi</h1>
					<p className="text-sm text-gray-500">A simple note taking app</p>
				</div>
				<div className="flex flex-col gap-2">
					<Link href={'/auth/login'}>Login</Link>
				</div>
			</main>
		</div>
	);
}
