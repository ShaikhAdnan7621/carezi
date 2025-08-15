"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
	Home,
	Users,
	Building2,
	User,
	Search,
	Bell,
	Settings,
	LogOut,
	Menu,
	X,
	ChevronDown,
	MessageSquare,
	Calendar,
	Heart,
	Bookmark,
	HelpCircle,
	Moon,
	Sun,
} from "lucide-react"

// Mock user data - replace with real user data
const mockUser = {
	name: "Dr. Sarah Johnson",
	email: "sarah.johnson@example.com",
	avatar: "/placeholder.svg?height=40&width=40",
	role: "Medical Professional",
	notifications: 3,
}

// Navigation items with icons
const navigationItems = [
	{
		name: "CEAR Posts",
		href: "/cear/feed",
		icon: Home,
		description: "Clinical Experience and Reflection posts",
	},
	{
		name: "Professionals",
		href: "/professional",
		icon: Users,
		description: "Browse healthcare professionals",
	},
	{
		name: "Organizations",
		href: "/organizations",
		icon: Building2,
		description: "Find medical Organizations",
	},
	{
		name: "Profile",
		href: "/profile",
		icon: User,
		description: "Manage your profile",
	},
]

// Quick actions for search
const quickActions = [
	{ name: "Find Doctors", icon: Users, href: "/professional?type=doctor" },
	{ name: "View CEAR Posts", icon: MessageSquare, href: "/cear/feed" },
	{ name: "Create CEAR Post", icon: Bookmark, href: "/cear/my" },
	{ name: "Health Records", icon: Bookmark, href: "/records" },
]

function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const [isScrolled, setIsScrolled] = useState(false)
	const [isDarkMode, setIsDarkMode] = useState(false)
	const pathname = usePathname()
	const searchRef = useRef(null)

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	// Handle search focus
	useEffect(() => {
		if (isSearchOpen && searchRef.current) {
			searchRef.current.focus()
		}
	}, [isSearchOpen])

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMenuOpen(false)
	}, [pathname])

	const isActiveRoute = (href) => {
		return pathname === href || (href !== "/" && pathname.startsWith(href))
	}

	const handleSearch = (e) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			// Handle search logic here
			console.log("Searching for:", searchQuery)
			setIsSearchOpen(false)
			setSearchQuery("")
		}
	}

	return (
		<>
			<header
				className={`fixed w-full z-50 top-0 transition-all duration-300 ${isScrolled
					? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50"
					: "bg-white/90 backdrop-blur-sm shadow-md"
					}`}
			>
				<div className="container px-4 mx-auto lg:max-w-7xl">
					<div className="flex items-center justify-between h-16 lg:h-20">
						{/* Logo */}
						<div className="flex items-center space-x-4">
							<Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
								<Image
									//   src="/placeholder.svg?height=40&width=120"
									src="/Logo.svg"
									alt="HealthConnect"
									width={120}
									height={40}
									priority
									className="object-contain"
								/>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden lg:flex items-center space-x-1">
							{navigationItems.map((item) => {
								const Icon = item.icon
								const isActive = isActiveRoute(item.href)
								return (
									<Link
										key={item.name}
										href={item.href}
										className={`group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
											? "text-green-600 bg-green-50 shadow-sm"
											: "text-gray-700 hover:text-green-600 hover:bg-green-50"
											}`}
									>
										<Icon className="w-4 h-4 mr-2" />
										{item.name}
										{isActive && (
											<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"></div>
										)}
									</Link>
								)
							})}
						</nav>

						{/* Desktop Actions */}
						<div className="hidden lg:flex items-center space-x-3">
							{/* Search Button
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Search className="w-4 h-4" />
              </Button> */}

							{/* Dark Mode Toggle */}
							{/* <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button> */}

							{/* Notifications */}
							{/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Bell className="w-4 h-4" />
                    {mockUser.notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                        {mockUser.notifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Badge variant="secondary">{mockUser.notifications}</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">New appointment request</p>
                      <p className="text-xs text-gray-500">Dr. Smith wants to schedule a consultation</p>
                      <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Profile updated successfully</p>
                      <p className="text-xs text-gray-500">Your professional profile has been verified</p>
                      <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-green-600 hover:text-green-700">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

							{/* User Profile Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 p-2">
										<Avatar className="h-8 w-8">
											<AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
											<AvatarFallback className="bg-green-100 text-green-700">
												{mockUser.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className="hidden xl:block text-left">
											<p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
											<p className="text-xs text-gray-500">{mockUser.role}</p>
										</div>
										<ChevronDown className="w-4 h-4 text-gray-500" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-64">
									<DropdownMenuLabel>
										<div className="flex items-center space-x-3">
											<Avatar className="h-10 w-10">
												<AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
												<AvatarFallback className="bg-green-100 text-green-700">
													{mockUser.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">{mockUser.name}</p>
												<p className="text-xs text-gray-500">{mockUser.email}</p>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/profile" className="flex items-center space-x-2">
											<User className="w-4 h-4" />
											<span>My Profile</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/messages" className="flex items-center space-x-2">
											<MessageSquare className="w-4 h-4" />
											<span>Messages</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/appointments" className="flex items-center space-x-2">
											<Calendar className="w-4 h-4" />
											<span>Appointments</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/cear/my" className="flex items-center space-x-2">
											<MessageSquare className="w-4 h-4" />
											<span>My CEAR Posts</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/favorites" className="flex items-center space-x-2">
											<Heart className="w-4 h-4" />
											<span>Favorites</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/settings" className="flex items-center space-x-2">
											<Settings className="w-4 h-4" />
											<span>Settings</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/help" className="flex items-center space-x-2">
											<HelpCircle className="w-4 h-4" />
											<span>Help & Support</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
										<Link href="/auth/logout" className="flex items-center">
											<LogOut className="w-4 h-4 mr-2" />
											Sign Out
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Mobile Menu Button */}
						<div className="lg:hidden">
							<Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
										<Menu className="w-5 h-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-80">
									<SheetHeader>
										<SheetTitle className="flex items-center space-x-3">
											<Avatar className="h-10 w-10">
												<AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
												<AvatarFallback className="bg-green-100 text-green-700">
													{mockUser.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="text-left">
												<p className="font-medium">{mockUser.name}</p>
												<p className="text-sm text-gray-500">{mockUser.role}</p>
											</div>
										</SheetTitle>
									</SheetHeader>

									<div className="mt-6 space-y-1">
										{navigationItems.map((item) => {
											const Icon = item.icon
											const isActive = isActiveRoute(item.href)
											return (
												<Link
													key={item.name}
													href={item.href}
													className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${isActive ? "text-green-600 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
														}`}
													onClick={() => setIsMenuOpen(false)}
												>
													<Icon className="w-5 h-5" />
													<div>
														<p className="font-medium">{item.name}</p>
														<p className="text-xs text-gray-500">{item.description}</p>
													</div>
												</Link>
											)
										})}
									</div>

									<Separator className="my-6" />

									<div className="space-y-1">
										<Link
											href="/cear/my"
											className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50"
											onClick={() => setIsMenuOpen(false)}
										>
											<MessageSquare className="w-5 h-5" />
											<span>My CEAR Posts</span>
										</Link>
										<Link
											href="/messages"
											className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50"
											onClick={() => setIsMenuOpen(false)}
										>
											<MessageSquare className="w-5 h-5" />
											<span>Messages</span>
										</Link>
										<Link
											href="/settings"
											className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50"
											onClick={() => setIsMenuOpen(false)}
										>
											<Settings className="w-5 h-5" />
											<span>Settings</span>
										</Link>
										<Link
											href="/help"
											className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50"
											onClick={() => setIsMenuOpen(false)}
										>
											<HelpCircle className="w-5 h-5" />
											<span>Help & Support</span>
										</Link>
									</div>

									<Separator className="my-6" />

									<Link href="/auth/logout">
										<Button
											variant="outline"
											className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
										>
											<LogOut className="w-4 h-4 mr-2" />
											Log Out
										</Button>
									</Link>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</header>

			{/* Search Overlay */}
			{isSearchOpen && (
				<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
					<div className="flex items-start justify-center pt-20 px-4">
						<div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
							<form onSubmit={handleSearch} className="p-6">
								<div className="flex items-center space-x-4">
									<Search className="w-6 h-6 text-gray-400" />
									<Input
										ref={searchRef}
										type="text"
										placeholder="Search professionals, Organizations, or services..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="flex-1 border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setIsSearchOpen(false)}
										className="text-gray-400 hover:text-gray-600"
									>
										<X className="w-5 h-5" />
									</Button>
								</div>
							</form>

							{searchQuery.length === 0 && (
								<div className="px-6 pb-6">
									<p className="text-sm text-gray-500 mb-4">Quick Actions</p>
									<div className="grid grid-cols-2 gap-3">
										{quickActions.map((action) => {
											const Icon = action.icon
											return (
												<Link
													key={action.name}
													href={action.href}
													className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 transition-colors"
													onClick={() => setIsSearchOpen(false)}
												>
													<Icon className="w-5 h-5 text-green-600" />
													<span className="text-sm font-medium">{action.name}</span>
												</Link>
											)
										})}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Spacer to prevent content from hiding behind fixed header */}
			<div className="h-16 lg:h-20"></div>
		</>
	)
}

export default Header