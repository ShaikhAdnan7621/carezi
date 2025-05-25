"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="fixed w-full bg-green-50 shadow-sm z-50 top-0">
			<div className="container px-4 mx-auto lg:max-w-[80%]">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link href="/">
							<Image
								src="/logo.svg"
								alt="Logo"
								width={102}
								height={32}
								priority
							/>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex space-x-8">
						<Link
							href="/feed"
							className="text-black bg-green-50 shadow-inner shadow-green-50 hover:bg-green-100 focus:bg-green-100 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100 "
							prefetch={false}
						>
							Feed
						</Link>
						<Link
							href="/professional"
							className="text-black bg-green-50 shadow-inner shadow-green-50 hover:bg-green-100 focus:bg-green-100 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100 "
						>
							Professionals
						</Link>
						<Link
							href="/facilities"
							className="text-black bg-green-50 shadow-inner shadow-green-50 hover:bg-green-100 focus:bg-green-100 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100 "
						>
							Facilities
						</Link>
						<Link
							href="/profile"
							className="text-black bg-green-50 shadow-inner shadow-green-50 hover:bg-green-100 focus:bg-green-100 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100 "
						>
							Profile
						</Link>
					</nav>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
						>
							<span className="sr-only">Open main menu</span>
							{/* Hamburger icon */}
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							<Link
								href="/feed"
								className='block text-black bg-green-50 hover:bg-green-100 focus:bg-green-100 group  h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100'
 							>
								Feed
							</Link>
							<Link
								href="/professional"
								className='block text-black bg-green-50 hover:bg-green-100 focus:bg-green-100 group  h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100'

 							>
								Professionals
							</Link>
							<Link
								href="/facilities"
								className='block text-black bg-green-50 hover:bg-green-100 focus:bg-green-100 group  h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100'

 							>
								Facilities
							</Link>
							<Link
								href="/profile"
								className='block text-black bg-green-50 hover:bg-green-100 focus:bg-green-100 group  h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-green-100 data-[state=open]:bg-green-100'
 							>
								Profile
							</Link>
						</div>
					</div>
				)}
			</div>
		</header >
	);
}

export default Header;
