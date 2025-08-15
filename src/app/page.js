"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, UserPlus, Users, Stethoscope, Calendar, Award, TrendingUp, Zap, Globe, Shield, Star, Play, ArrowRight, CheckCircle, Network, Activity, Send, } from "lucide-react"
import NavBar from "@/components/pageComponents/layout/Navbar"

export default function HomePage() {
	const [activePost, setActivePost] = useState(0)
	const [connectionCount, setConnectionCount] = useState(10247)
	const [isLiked, setIsLiked] = useState(false)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [cursorTrail, setCursorTrail] = useState([])

	useEffect(() => {
		const handleMouseMove = (e) => {
			setMousePosition({ x: e.clientX, y: e.clientY })
			setCursorTrail((prev) => {
				const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]
				return newTrail.slice(-8) // Keep only last 8 trail points
			})
		}
		window.addEventListener("mousemove", handleMouseMove)
		return () => window.removeEventListener("mousemove", handleMouseMove)
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			setCursorTrail((prev) => prev.slice(1))
		}, 100)
		return () => clearInterval(interval)
	}, [])

	const socialPosts = [
		{
			id: 1,
			author: "Dr. Sarah Chen",
			role: "Cardiologist",
			avatar: "/placeholder.svg?height=50&width=50",
			time: "2 hours ago",
			content:
				"Just completed a groundbreaking cardiac procedure using AI-assisted imaging! 🫀 The future of medicine is here.",
			likes: 127,
			comments: 23,
			shares: 8,
			image: "/placeholder.svg?height=300&width=400",
		},
		{
			id: 2,
			author: "Nurse Mike Rodriguez",
			role: "ICU Specialist",
			avatar: "/placeholder.svg?height=50&width=50",
			time: "4 hours ago",
			content: "Celebrating 5 years in the ICU! Grateful for my amazing team and the lives we've touched together. 💙",
			likes: 89,
			comments: 15,
			shares: 5,
		},
		{
			id: 3,
			author: "Dr. Emily Watson",
			role: "Pediatrician",
			avatar: "/placeholder.svg?height=50&width=50",
			time: "6 hours ago",
			content:
				"New research shows promising results for childhood diabetes treatment. Excited to share findings at next week's conference! 📊",
			likes: 156,
			comments: 31,
			shares: 12,
		},
	]

	const FloatingElements = () => (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{[...Array(12)].map((_, i) => (
				<div
					key={i}
					className="absolute animate-float opacity-10"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						animationDelay: `${Math.random() * 8}s`,
						animationDuration: `${6 + Math.random() * 6}s`,
					}}
				>
					{i % 3 === 0 && <Stethoscope className="w-4 h-4 text-green-500" />}
					{i % 3 === 1 && <Heart className="w-3 h-3 text-green-400" />}
					{i % 3 === 2 && <Users className="w-3 h-3 text-green-600" />}
				</div>
			))}
		</div>
	)

	const CursorTrail = () => (
		<div className="fixed inset-0 pointer-events-none z-50">
			{cursorTrail.map((point, index) => (
				<div
					key={point.id}
					className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
					style={{
						left: point.x - 4,
						top: point.y - 4,
						opacity: ((index + 1) / cursorTrail.length) * 0.6,
						animationDelay: `${index * 50}ms`,
					}}
				/>
			))}
			<div
				className="absolute w-4 h-4 bg-green-500/30 rounded-full blur-sm"
				style={{
					left: mousePosition.x - 8,
					top: mousePosition.y - 8,
				}}
			/>
		</div>
	)

	return (
		<div className=" min-h-screen bg-background relative overflow-hidden">
			<FloatingElements />
			<CursorTrail />

			<section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative">
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left: Live Social Feed Simulation */}
						<div className="relative h-[500px] lg:h-[600px]">
							<div className="absolute inset-0 glass-strong rounded-2xl overflow-hidden shadow-xl border border-green-200/20">
								{/* Feed Header */}
								<div className="p-4 border-b border-green-200/20 bg-green-50/30">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-bold text-green-800">Healthcare Feed</h3>
										<div className="flex items-center space-x-2">
											<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
											<span className="text-xs text-green-600">Live</span>
										</div>
									</div>
								</div>

								{/* Social Posts */}
								<div className="p-3 space-y-3 h-full overflow-y-auto">
									{socialPosts.map((post, index) => (
										<div
											key={post.id}
											className={`glass rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border border-green-200/10 ${activePost === index ? "ring-1 ring-green-500 shadow-lg bg-green-50/20" : "hover:bg-green-50/10"
												}`}
											onClick={() => setActivePost(index)}
										>
											{/* Post Header */}
											<div className="flex items-center space-x-2 mb-2">
												<img
													src={post.avatar || "/placeholder.svg"}
													alt={post.author}
													className="w-10 h-10 rounded-full border-2 border-green-300/30"
												/>
												<div className="flex-1">
													<h4 className="font-semibold text-green-800 text-sm">{post.author}</h4>
													<p className="text-xs text-green-600">
														{post.role} • {post.time}
													</p>
												</div>
												<UserPlus className="w-4 h-4 text-green-500 hover:scale-110 hover:text-green-600 transition-all cursor-pointer" />
											</div>

											{/* Post Content */}
											<p className="text-green-700 mb-2 leading-relaxed text-sm">{post.content}</p>

											{/* Post Image */}
											{post.image && (
												<img
													src={post.image || "/placeholder.svg"}
													alt="Post content"
													className="w-full h-24 object-cover rounded-lg mb-2"
												/>
											)}

											{/* Post Actions */}
											<div className="flex items-center justify-between pt-2 border-t border-green-200/20">
												<div className="flex items-center space-x-3">
													<button
														className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-all group"
														onClick={(e) => {
															e.stopPropagation()
															setIsLiked(!isLiked)
														}}
													>
														<Heart
															className={`w-4 h-4 group-hover:scale-125 transition-transform ${isLiked ? "fill-green-500 text-green-500" : ""}`}
														/>
														<span className="text-xs">{post.likes}</span>
													</button>
													<button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-all group">
														<MessageCircle className="w-4 h-4 group-hover:scale-125 transition-transform" />
														<span className="text-xs">{post.comments}</span>
													</button>
													<button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-all group">
														<Share2 className="w-4 h-4 group-hover:scale-125 transition-transform" />
														<span className="text-xs">{post.shares}</span>
													</button>
												</div>
												<button className="text-green-500 hover:text-green-600 hover:scale-110 transition-all">
													<Send className="w-4 h-4" />
												</button>
											</div>
										</div>
									))}

									{/* Connection Notification */}
									<div className="glass rounded-xl p-3 bg-gradient-to-r from-green-100/50 to-green-200/50 animate-notification-pop border border-green-300/20">
										<div className="flex items-center space-x-2">
											<div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
												<Network className="w-4 h-4 text-white" />
											</div>
											<div className="flex-1">
												<p className="font-semibold text-green-800 text-sm">New Connection Request</p>
												<p className="text-xs text-green-600">Dr. James Wilson wants to connect</p>
											</div>
											<div className="flex space-x-1">
												<button className="px-2 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors">
													Accept
												</button>
												<button className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200 transition-colors">
													Decline
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Floating Stats */}
							<div className="absolute -top-3 -right-3 glass-strong rounded-xl p-3 shadow-lg animate-pulse-glow border border-green-200/20">
								<div className="text-center">
									<p className="text-lg font-bold text-green-800">{connectionCount.toLocaleString()}</p>
									<p className="text-xs text-green-600">Active Professionals</p>
								</div>
							</div>

							<div className="absolute -bottom-8 -left-3 glass-strong rounded-xl p-3 shadow-lg border border-green-200/20">
								<div className="flex items-center space-x-2">
									<div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
										<TrendingUp className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-semibold text-green-800 text-sm">98% Match Rate</p>
										<p className="text-xs text-green-600">Professional Connections</p>
									</div>
								</div>
							</div>
						</div>

						{/* Right: Hero Content */}
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="inline-flex items-center space-x-2 glass px-3 py-1 rounded-full border border-green-200/20">
									<Globe className="w-3 h-3 text-green-500" />
									<span className="text-xs font-medium text-green-700">Healthcare Social Network</span>
								</div>

								<h1 className="text-4xl lg:text-6xl font-bold text-green-800 leading-tight">
									Where Healthcare{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600">
										Professionals
									</span>{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
										Connect
									</span>
								</h1>

								<p className="text-lg text-green-700 leading-relaxed">
									Join the revolutionary social platform designed exclusively for healthcare professionals. Share
									knowledge, build connections, and advance your career in a trusted community.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3">
								<button className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
									<span className="relative z-10 flex items-center space-x-2">
										<span>Join the Community</span>
										<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
									</span>
									<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</button>

								<button className="px-6 py-3 glass border border-green-300/30 text-green-700 font-semibold rounded-xl hover:bg-green-50/50 hover:border-green-400/50 transition-all duration-300 shadow-sm hover:shadow-md flex items-center space-x-2">
									<Play className="w-4 h-4" />
									<span>Watch Demo</span>
								</button>
							</div>

							{/* Social Proof */}
							<div className="flex items-center space-x-4 pt-3">
								<div className="flex -space-x-2">
									{[...Array(5)].map((_, i) => (
										<img
											key={i}
											src={`/placeholder.svg?height=32&width=32&query=doctor-${i + 1}`}
											alt={`Professional ${i + 1}`}
											className="w-8 h-8 rounded-full border-2 border-background"
										/>
									))}
								</div>
								<div>
									<p className="text-sm font-semibold text-green-800">Join 50,000+ professionals</p>
									<p className="text-xs text-green-600">Building the future of healthcare</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 px-4 sm:px-6 lg:px-8 relative">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<div className="inline-flex items-center space-x-2 glass px-3 py-1 rounded-full mb-4 border border-green-200/20">
							<Zap className="w-3 h-3 text-green-500" />
							<span className="text-xs font-medium text-green-700">Platform Features</span>
						</div>
						<h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-3">Social Features Built for Healthcare</h2>
						<p className="text-lg text-green-700">Connect, collaborate, and grow your professional network</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								icon: MessageCircle,
								title: "Professional Discussions",
								description: "Join topic-based discussions with verified healthcare professionals worldwide",
								color: "from-green-400 to-green-500",
								features: ["Medical case studies", "Research collaboration", "Best practices sharing"],
							},
							{
								icon: Users,
								title: "Smart Networking",
								description: "AI-powered matching connects you with relevant professionals in your field",
								color: "from-green-500 to-green-600",
								features: ["Specialty matching", "Location-based connections", "Experience level filtering"],
							},
							{
								icon: Calendar,
								title: "Integrated Scheduling",
								description: "Seamlessly book consultations and meetings with your professional network",
								color: "from-green-400 to-green-600",
								features: ["Calendar integration", "Automated reminders", "Video call support"],
							},
							{
								icon: Award,
								title: "Achievement System",
								description: "Showcase your expertise and build credibility through peer recognition",
								color: "from-green-500 to-green-400",
								features: ["Peer endorsements", "Skill verification", "Professional badges"],
							},
							{
								icon: Shield,
								title: "Verified Profiles",
								description: "All professionals are verified to ensure authentic healthcare connections",
								color: "from-green-400 to-green-500",
								features: ["License verification", "Institution confirmation", "Background checks"],
							},
							{
								icon: Activity,
								title: "Knowledge Sharing",
								description: "Share insights, research, and experiences with the healthcare community",
								color: "from-green-500 to-green-600",
								features: ["Research publications", "Case study sharing", "Educational content"],
							},
						].map((feature, index) => (
							<div key={index} className="group relative">
								<div className="glass-strong rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-green-200/20">
									<div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-green-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

									<div className="relative z-10 space-y-4">
										<div
											className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
										>
											<feature.icon className="w-6 h-6 text-white" />
										</div>

										<div>
											<h3 className="text-lg font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors">
												{feature.title}
											</h3>
											<p className="text-green-700 leading-relaxed mb-3 text-sm">{feature.description}</p>

											<ul className="space-y-1">
												{feature.features.map((item, i) => (
													<li key={i} className="flex items-center space-x-2 text-xs text-green-600">
														<CheckCircle className="w-3 h-3 text-green-500" />
														<span>{item}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50/50 to-green-100/50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-green-800 mb-3">Join the Largest Healthcare Community</h2>
						<p className="text-lg text-green-700">Trusted by professionals worldwide</p>
					</div>

					<div className="grid md:grid-cols-4 gap-6 mb-12">
						{[
							{ number: "50,000+", label: "Active Professionals", icon: Users },
							{ number: "200+", label: "Medical Specialties", icon: Stethoscope },
							{ number: "1M+", label: "Professional Connections", icon: Network },
							{ number: "98%", label: "User Satisfaction", icon: Star },
						].map((stat, index) => (
							<div key={index} className="text-center group">
								<div className="glass-strong rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-green-200/20">
									<stat.icon className="w-10 h-10 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
									<div className="text-2xl font-bold text-green-800 mb-1">{stat.number}</div>
									<div className="text-green-600 text-sm">{stat.label}</div>
								</div>
							</div>
						))}
					</div>

					{/* Testimonial Carousel */}
					<div className="glass-strong rounded-2xl p-6 shadow-xl border border-green-200/20">
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<img
									src="/placeholder.svg?height=64&width=64"
									alt="Dr. Maria Rodriguez"
									className="w-16 h-16 rounded-full border-3 border-green-300/30"
								/>
							</div>
							<blockquote className="text-lg text-green-800 italic leading-relaxed max-w-2xl mx-auto">
								"Carezi has revolutionized how I connect with colleagues. The platform's focus on healthcare
								professionals creates meaningful connections that directly impact patient care."
							</blockquote>
							<div>
								<div className="font-bold text-green-800">Dr. Maria Rodriguez</div>
								<div className="text-green-600 font-medium text-sm">Chief of Cardiology, Metro General Hospital</div>
							</div>
							<div className="flex justify-center space-x-1">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-green-600/90"></div>
				<div className="absolute inset-0">
					{[...Array(30)].map((_, i) => (
						<div
							key={i}
							className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 3}s`,
							}}
						/>
					))}
				</div>

				<div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
					<h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
						Ready to Transform Your Healthcare Network?
					</h2>
					<p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
						Join thousands of healthcare professionals building meaningful connections and advancing their careers
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="group px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl relative overflow-hidden">
							<span className="relative z-10 flex items-center space-x-2">
								<span>Start Building Your Network</span>
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</span>
							<div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</button>

						<button className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center space-x-2">
							<Play className="w-4 h-4" />
							<span>Watch Demo</span>
						</button>
					</div>
				</div>
			</section>

			<footer className="py-12 px-4 sm:px-6 lg:px-8 bg-green-900">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-4 gap-6 mb-8">
						<div className="space-y-3">
							<h3 className="text-xl font-bold text-white">Carezi</h3>
							<p className="text-green-200 leading-relaxed text-sm">
								The social platform connecting healthcare professionals worldwide for better patient care and
								professional growth.
							</p>
							<div className="flex space-x-3">
								{[MessageCircle, Users, Heart].map((Icon, i) => (
									<div
										key={i}
										className="w-8 h-8 bg-green-700/50 rounded-full flex items-center justify-center hover:bg-green-600/50 transition-colors cursor-pointer"
									>
										<Icon className="w-4 h-4 text-green-300" />
									</div>
								))}
							</div>
						</div>

						{/* {[
							{
								title: "Platform",
								links: [
									"Features",
									"Pricing",
									"Security",
									"API"
								],
							},
							{
								title: "Community",
								links: [
									"Professionals",
									"Organizations",
									"Resources",
									"Events"
								],
							},
							{
								title: "Support",
								links: [
									"Help Center",
									"Contact",
									"Privacy",
									"Terms"
								],
							},
						].map((section, index) => (
							<div key={index} className="space-y-3">
								<h4 className="font-semibold text-white">{section.title}</h4>
								<ul className="space-y-1">
									{section.links.map((link, i) => (
										<li key={i}>
											<a href="#" className="text-green-200 hover:text-green-100 transition-colors text-sm">
												{link}
											</a>
										</li>
									))}
								</ul>
							</div>
						))} */}
					</div>

					<div className="border-t border-green-800 pt-6 text-center">
						<p className="text-green-200 text-sm">© 2024 Carezi. Connecting healthcare professionals worldwide.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
