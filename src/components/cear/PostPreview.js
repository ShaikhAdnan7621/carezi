"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Hash, AtSign, HelpCircle, Calendar, ImageIcon } from "lucide-react"
import MarkdownView from "../MarkdownView"
import ImageCarousel from "../ui/image-carousel"


export default function PostPreview({
	content,
	attachments,
	question,
	tags = [],
	mentions = [],
	visibility = "public",
}) {
	if (!content && attachments.length === 0 && !question) {
		return (
			<Card className="border-dashed">
				<CardContent className="flex items-center justify-center py-12 text-center">
					<div className="text-gray-500">
						<Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
						<p>Your post preview will appear here</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	const getVisibilityIcon = (vis) => {
		return <Eye className="h-3 w-3" />
	}

	return (
		<Card className="border-dashed">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
					<Eye className="h-4 w-4" />
					Preview
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Mock User Header */}
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarFallback>You</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-sm">Your Name</span>
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Calendar className="h-3 w-3" />
							<span>Just now</span>
							{getVisibilityIcon(visibility)}
							<span className="capitalize">{visibility}</span>
						</div>
					</div>
				</div>

				{/* Attachments */}
				{attachments.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<ImageIcon className="h-4 w-4" />
							<span>
								{attachments.length} image{attachments.length > 1 ? "s" : ""}
							</span>
						</div>
						<div className="carousel-container">
							<ImageCarousel images={attachments} />
						</div>
					</div>
				)}

				{/* Content */}
				{content && (
					<MarkdownView
						content={content}
						maxHeight="400px"
						minHeight="100px"
						showWordCount={true}
						truncate={true}
						maxLines={3}
						hasImages={attachments.length > 0}
					/>
				)}

				{/* Question */}
				{question && (
					<div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
						<div className="flex items-center gap-2 mb-1">
							<HelpCircle className="h-4 w-4 text-blue-600" />
							<span className="text-sm font-medium text-blue-800">Question</span>
						</div>
						<p className="text-blue-700">{question}</p>
					</div>
				)}

				{/* Tags */}
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{tags.map((tag, index) => (
							<Badge key={index} variant="secondary" className="text-xs">
								<Hash className="h-2 w-2 mr-1" />
								{tag}
							</Badge>
						))}
					</div>
				)}

				{/* Mentions */}
				{mentions.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{mentions.map((mention, index) => (
							<Badge key={index} variant="outline" className="text-xs">
								<AtSign className="h-2 w-2 mr-1" />
								{mention}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}