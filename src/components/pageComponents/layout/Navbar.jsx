"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import axios from "axios"
import {
	Search,
	Bell,
	Menu,
	X,
	ChevronDown,
	User,
	LogOut,
	Settings,
	Briefcase,
	Network,
	Calendar,
	Building2,
	Rss,
	BookUser,
	HelpCircle,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function NavBar() {
	const [user, setUser] = useState(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [megaMenuOpen, setMegaMenuOpen] = useState(false)

	const megaMenuRef = useRef(null)

	useEffect(() => {
		fetchUserData()
	}, [])

	const profileDropdownRef = useRef(null)
	const router = useRouter()

	useEffect(() => {
		const handleClickOutside = event => {
			if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
				setIsProfileOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const fetchUserData = async () => {
		try {
			const response = await axios.get("/api/userdatafornav")
			setUser(response.data)
		} catch (error) {
			console.error("Error fetching user:", error)
		} finally {
			setLoading(false)
		}
	}

	const handleLogout = async () => {
		try {
			await axios.post("/api/auth/logout")
			setUser(null)
			router.push("/auth/login")
			router.refresh() // Ensures server components are re-rendered with fresh data
		} catch (error) {
			console.error("Logout failed:", error)
		}
	}

	const navigationSections = useMemo(
		() => ({
			professional: {
				title: "Professional",
				mainLink: "/professional",
				color: "green",
				links: user?.isProfessional ?
					[
						{ label: "Find Professional", href: "/professional", icon: Briefcase },
						{ label: "My Affiliations", href: "/professional/my/affiliations", icon: Network },
						{ label: "My Appointments", href: "/professional/my/appointments", icon: Calendar },
						{ label: "My Profile", href: `/professional/my`, icon: User },
					] :
					[{ label: "Find Professionals", href: "/professional", icon: Briefcase }],
			},
			organization: {
				title: "Organization",
				mainLink: "/organizations",
				color: "green",
				links: [
					{ label: "Find Organizations", href: "/organizations", icon: Building2 },
					{ label: "My Affiliations", href: "/organizations/my/affiliations", icon: Network },
					{ label: "My Appointments", href: "/organizations/my/appointments", icon: Calendar },
					{
						label: "My Profile",
						href: user?.managedOrganizations?.[0] ? `/organizations/my` : "/organizations",
						icon: Building2,
					},
				],
			},
			cear: {
				title: "CEAR",
				mainLink: "/cear/feed",
				color: "green",
				links: [
					{ label: "Feed", href: "/cear/feed", icon: Rss },
					{ label: "My CEAR", href: "/cear/my", icon: BookUser },
				],
			},
			account: {
				title: "Quick Access",
				mainLink: "/profile",
				color: "green",
				links: [
					{ label: "Profile", href: "/profile", icon: User },
					{ label: "My Appointments", href: "/my/appointments", icon: Calendar },
					{ label: "Notifications", href: "/notifications", icon: Bell },
					{ label: "Help Center", href: "/help", icon: HelpCircle },
				],
			},
		}),
		[user]
	)

	const handleNavHover = () => setMegaMenuOpen(true)
	const handleNavLeave = () => setMegaMenuOpen(false)

	if (loading) {
		return (
			<nav className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
				<div className="px-4 mx-auto lg:max-w-7xl">
					<div className="flex justify-between items-center h-14">
						<div className="flex items-center space-x-4">
							<div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
							<div className="hidden md:flex space-x-3">
								<div className="w-14 h-4 bg-gray-200 rounded animate-pulse"></div>
								<div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
							</div>
						</div>
						<div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<div className="relative">
			<nav
				className="bg-white backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300 shadow-sm"
				onMouseEnter={handleNavHover}
				onMouseLeave={handleNavLeave}
				ref={megaMenuRef}
			>
				<div className="px-4 mx-auto lg:max-w-7xl">
					<div className="flex justify-between items-center h-14">
						<div className="flex items-center space-x-4">
							<Link href="/" className="flex items-center">
								<div className="w-18 h-14 rounded-lg flex items-center justify-center overflow-hidden">
									<Image src="/Logo.svg" alt="Carezi" width={72} height={28} className="object-contain" />
								</div>
							</Link>

							<div className="hidden md:flex items-center space-x-0.5">
								{Object.entries(navigationSections).map(([key, section]) => (
									<Link
										key={key}
										href={section.mainLink}
										className="text-slate-700 hover:text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all duration-200 text-sm font-medium relative group"
									>
										{section.title}
										<span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full"></span>
									</Link>
								))}
							</div>
						</div>

						<div className="flex items-center space-x-2">
							{user ? (
								<>
									<button className="relative p-1.5 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
										<Bell className="w-4 h-4" />
										<span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:bg-green-600"></span>
									</button>

									<div className="relative" ref={profileDropdownRef}>
										<button
											onClick={() => setIsProfileOpen(prev => !prev)}
											className="flex items-center space-x-2 p-1 rounded-lg hover:bg-green-50 transition-all duration-200"
											aria-haspopup="true"
											aria-expanded={isProfileOpen}
										>
											<img
												src={user.profilePic || "/placeholder.svg?height=26&width=26&query=user+avatar"}
												alt={user.name}
												className="w-6 h-6 rounded-full object-cover ring-2 ring-green-100 transition-all"
											/>
											<span className="hidden sm:block text-sm font-medium text-slate-700 max-w-20 truncate">
												{user.name}
											</span>
											<ChevronDown
												className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
											/>
										</button>
										<div
											className={`absolute top-full right-0 mt-1 w-48 bg-white/40 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl transition-all duration-200 transform ${isProfileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"}`}
										>
											<Link
												href="/profile"
												className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 rounded-t-xl transition-all"
											>
												<User className="w-4 h-4" />
												<span>Profile</span>
											</Link>
											<Link
												href="/my/affiliations"
												className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-all"
											>
												<Settings className="w-4 h-4" />
												<span>My Affiliations</span>
											</Link>
											<Link
												href="/settings"
												className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-all"
											>
												<Settings className="w-4 h-4" />
												<span>Settings</span>
											</Link>
											<button
												onClick={handleLogout}
												className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-b-xl transition-all"
											>
												<LogOut className="w-4 h-4" />
												<span>Logout</span>
											</button>
										</div>
									</div>
								</>
							) : (
								<div className="flex items-center space-x-2">
									<Link
										href="/auth/login"
										className="text-slate-700 hover:text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all text-sm font-medium"
									>
										Login
									</Link>
									<Link
										href="/auth/signup"
										className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
									>
										Sign Up
									</Link>
								</div>
							)}

							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="md:hidden p-1.5 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
							>
								{isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
							</button>
						</div>
					</div>
				</div>
			</nav>

			{megaMenuOpen && (
				<div
					className="absolute top-full left-0 w-full bg-white/40 backdrop-blur-md border-b border-slate-200 shadow-xl z-40 hidden md:block"
					onMouseEnter={handleNavHover}
					onMouseLeave={handleNavLeave}
				>
					<div className="mx-auto lg:max-w-7xl px-[10%] py-5">
						<div className="grid grid-cols-4 gap-6">
							{Object.entries(navigationSections).map(([key, section]) => (
								<div key={key} className="group">
									<h3 className="text-sm font-semibold text-slate-900 mb-2.5 flex items-center group-hover:text-green-600 transition-colors">
										<div
											className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2.5 group-hover:scale-125 transition-transform"
										></div>
										{section.title}
									</h3>
									<div className="space-y-0.5">
										{section.links.map((item, index) => (
											<Link
												key={index}
												href={item.href}
												className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:translate-x-1"
												onClick={() => setMegaMenuOpen(false)}
											>
												{item.icon && <item.icon className="w-4 h-4" />}
												<span>{item.label}</span>
											</Link>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{isMenuOpen && (
				<>
					<div
						className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300"
						onClick={() => setIsMenuOpen(false)}
					/>
					<div
						className={`fixed top-0 left-0 h-full w-72 bg-white/50 backdrop-blur-md shadow-2xl z-50 md:hidden transform transition-all duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
					>
						<div className="p-3 border-b border-slate-200">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2.5">
									<Image src={"/Logo.svg"} alt="Carezi" width={50} height={20} className="object-contain" />
									<span className="font-semibold text-slate-900 text-sm">Menu</span>
								</div>
								<button
									onClick={() => setIsMenuOpen(false)}
									className="p-1.5 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div className="p-3 overflow-y-scroll h-full">
							{/* <div className="relative">
								<Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
								<input
									type="text"
									placeholder="Search..."
									className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all"
								/>
							</div> */}
							<div className="pb-16 space-y-4 last:mb-10">
								{Object.entries(navigationSections).map(([key, section]) => (
									<div key={key}>
										<div className="font-semibold text-slate-900 mb-2 flex items-center text-sm">
											<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2.5"></div>
											{section.title}
										</div>
										<div className="space-y-0.5 ml-4">
											{section.links.map((item, index) => (
												<Link
													key={index}
													href={item.href}
													className="flex items-center gap-3 px-2.5 py-2 text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all text-sm"
													onClick={() => setIsMenuOpen(false)}
												>
													{item.icon && <item.icon className="w-4 h-4 text-slate-700" />}
													<span>{item.label}</span>
												</Link>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
