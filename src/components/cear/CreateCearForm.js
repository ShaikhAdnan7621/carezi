"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Hash, AtSign, HelpCircle, Upload, Loader2, AlertCircle, ChevronLeft, ChevronRight, Edit, ImageIcon, Tags, Settings, Send, Eye, EyeOff, X, HelpCircleIcon, } from "lucide-react"
import axios from "axios"
import PostPreview from "./PostPreview"
import Editor from "../Editor"
import { Dialog, DialogContent, DialogFooter, DialogTrigger, DialogTitle } from "../ui/dialog"
import ImageCarousel from "../ui/image-carousel"


const SECTIONS = [
	{ id: "content", title: "Content", icon: Edit },
	{ id: "question", title: "Ask Question", icon: HelpCircleIcon },
	{ id: "media", title: "Media", icon: ImageIcon },
	{ id: "tags", title: "Tags & Mentions", icon: Tags },
	{ id: "settings", title: "Settings", icon: Settings },
	{ id: "preview", title: "Preview & Submit", icon: Send },
]

export default function CreateCearForm({ parentId = null, isReply = false, onPostCreated }) {
	const [dialogOpen, setDialogOpen] = useState(false)

	const [currentSection, setCurrentSection] = useState(0)
	const [formData, setFormData] = useState({
		content: "",
		haveQuestion: false,
		question: "",
		visibility: "public",
		tags: [],
		mentions: [],
	})

	const [attachments, setAttachments] = useState([])
	const [uploading, setUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [error, setError] = useState(null)
	const [currentTag, setCurrentTag] = useState("")
	const [currentMention, setCurrentMention] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Handle input change for form data
	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		setError(null)
	}

	// File input change handler
	const onFileChange = async (e) => {
		const files = Array.from(e.target.files)
		if (!files.length) return

		setUploading(true)
		setUploadProgress(0)
		setError(null)

		try {
			// Simulate upload for each file
			for (const file of files) {
				const formDataUpload = new FormData()
				formDataUpload.append("file", file)
				formDataUpload.append("folder", "cear_images")

				// In a real app, you'd send this to your /api/uploadimage endpoint
				// For this example, we'll just create a local URL
				const simulatedUploadUrl = URL.createObjectURL(file)

				// Simulate progress
				let progress = 0
				const interval = setInterval(() => {
					progress += 10
					if (progress >= 100) {
						clearInterval(interval)
						setUploadProgress(100)
					} else {
						setUploadProgress(progress)
					}
				}, 100)

				await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

				setAttachments((prev) => [
					...prev,
					{
						fileUrl: simulatedUploadUrl, // Use simulated URL for preview
						fileName: file.name,
						fileType: file.type,
						fileSize: file.size,
						parentId: parentId || null, // This would be set after the Cear is created
						localFile: file, // Store the actual file object for submission
					},
				])
			}
		} catch (err) {
			setError("Image upload failed. Please try again.")
		} finally {
			setUploading(false)
			setUploadProgress(0)
			e.target.value = null // Clear input so same file can be selected again
		}
	}



	// Remove attachment by index
	const removeAttachment = (index) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index))
	}

	// Add and remove tags/mentions
	const addTag = () => {
		if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
			setFormData((prev) => ({
				...prev,
				tags: [...prev.tags, currentTag.trim()],
			}))
			setCurrentTag("")
		}
	}
	const removeTag = (tagToRemove) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}))
	}
	const addMention = () => {
		if (currentMention.trim() && !formData.mentions.includes(currentMention.trim())) {
			setFormData((prev) => ({
				...prev,
				mentions: [...prev.mentions, currentMention.trim()],
			}))
			setCurrentMention("")
		}
	}
	const removeMention = (mentionToRemove) => {
		setFormData((prev) => ({
			...prev,
			mentions: prev.mentions.filter((mention) => mention !== mentionToRemove),
		}))
	}

	// Section navigation helpers
	const nextSection = () => {
		if (currentSection < SECTIONS.length - 1) setCurrentSection(currentSection + 1)
	}
	const prevSection = () => {
		if (currentSection > 0) setCurrentSection(currentSection - 1)
	}
	const goToSection = (index) => setCurrentSection(index)

	// Validation check before moving forward or submitting
	const canProceedToNext = () => {
		switch (currentSection) {
			case 0: // Content section
				const textContent = formData.content.replace(/<[^>]*>/g, "").trim()
				if (!textContent) return false
				if (formData.haveQuestion && !formData.question.trim()) return false
				return true
			default:
				return true
		}
	}

	// Submit form with file uploads
	const onSubmit = async (e) => {
		e.preventDefault()
		const textContent = formData.content.replace(/<[^>]*>/g, "").trim()
		if (!textContent) {
			setError("Content cannot be empty")
			return
		}
		if (formData.haveQuestion && !formData.question.trim()) {
			setError("Question cannot be empty when question mode is enabled")
			return
		}

		setIsSubmitting(true)
		setError(null)

		try {
			const data = new FormData()
			data.append("content", formData.content)
			data.append("haveQuestion", formData.haveQuestion)
			data.append("question", formData.question)
			data.append("visibility", formData.visibility)
			data.append("tags", JSON.stringify(formData.tags))
			data.append("mentions", JSON.stringify(formData.mentions))
			data.append("postedBy", "USER_ID") // Replace with actual user ID
			data.append("isReply", isReply)
			data.append("parentId", parentId || "")

			// Append actual file objects for submission
			attachments.forEach((attachment) => {
				if (attachment.localFile) {
					data.append("attachment", attachment.localFile) // Use 'attachment' to match your schema
				}
			})

			const response = await axios.post("/api/cear/create", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
					setUploadProgress(percentCompleted)
				},
			})


			const createdPost = response.data.post


			// Reset form on success
			setFormData({
				content: "",
				haveQuestion: false,
				question: "",
				visibility: "public",
				tags: [],
				mentions: [],
			})
			setAttachments([])
			setError(null)
			setCurrentSection(0)


			setDialogOpen(false) // Close

			if (onPostCreated && createdPost) {
				onPostCreated(createdPost)
			}

		} catch (err) {
			setError("Failed to create post. Please try again.")
		} finally {
			setIsSubmitting(false)
			setUploadProgress(0)
		}
	}

	// Render each section content
	const renderSectionContent = () => {
		switch (currentSection) {
			case 0: // Content Section
				return (
					<div className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="content" className="block mb-2">{`What's on your mind? *`}</Label>
							{/* Editor must not be inside a paragraph */}
							<div className="editor-container">
								<Editor
									value={formData.content}
									onChange={(content) => handleInputChange("content", content)}
									placeholder="Share your thoughts with the community..."
									height="300px"
									maxLength={5000}
								/>
							</div>
						</div>
					</div>
				)

			case 1:
				return (
					<div className="space-y-6">

						<div className="space-y-2">

							<div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
								<div className="flex items-center gap-2">
									<HelpCircle className="h-4 w-4 text-blue-600" />
									<span className="text-base font-medium text-gray-800">
										Ask a Question
									</span>
								</div>
								<Switch
									id="question-mode"
									checked={formData.haveQuestion}
									onCheckedChange={(checked) => handleInputChange("haveQuestion", checked)}
								/>
							</div>

							{formData.haveQuestion && (
								<div className="space-y-2">
									<Label htmlFor="question">Your Question *</Label>
									<Input
										id="question"
										placeholder="What would you like to ask?"
										value={formData.question}
										onChange={(e) => handleInputChange("question", e.target.value)}
										className="focus-visible:ring-blue-500"
									/>
								</div>
							)}
						</div>
					</div>
				)

			case 2: // Media Section
				return (
					<div className="space-y-6">
						<div className="space-y-3">
							<Label className="text-base font-medium">Upload Images</Label>
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-blue-400">
								<input
									type="file"
									accept="image/*"
									multiple
									onChange={onFileChange}
									disabled={uploading}
									className="hidden"
									id="upload-images-input"
								/>
								<label htmlFor="upload-images-input" className="cursor-pointer flex flex-col items-center gap-3">
									{uploading ? (
										<Loader2 className="h-12 w-12 animate-spin text-gray-400" />
									) : (
										<Upload className="h-12 w-12 text-gray-400" />
									)}
									<div className="text-center">
										<p className="text-lg font-medium text-gray-700">
											{uploading ? "Uploading..." : "Click or drag to upload images"}
										</p>
										<p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
									</div>
								</label>
							</div>

							{uploading && (
								<div className="space-y-2">
									<Progress value={uploadProgress} className="w-full" />
									<p className="text-sm text-gray-600 text-center">{uploadProgress}% uploaded</p>
								</div>
							)}
						</div>

						{attachments.length > 0 && (
							<div className="space-y-3">
								<Label className="text-base font-medium">Uploaded Images ({attachments.length})</Label>
								<div className="carousel-container relative">
									<ImageCarousel images={attachments} />

									{/* Remove button for current image */}
									<div className="absolute top-2 right-2 z-10">
										<Button
											type="button"
											variant="destructive"
											size="sm"
											className="h-6 w-6 p-0 bg-black/50 hover:bg-red-600"
											onClick={() => removeAttachment(0)} // Remove the first image
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				)

			case 3: // Tags & Mentions Section
				return (
					<div className="space-y-6">
						<div className="space-y-3">
							<Label className="flex items-center gap-2 text-base font-medium">
								<Hash className="h-4 w-4 text-gray-600" />
								Tags
							</Label>
							<div className="flex gap-2">
								<Input
									placeholder="Add a tag..."
									value={currentTag}
									onChange={(e) => setCurrentTag(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault()
											addTag()
										}
									}}
									className="flex-1 focus-visible:ring-blue-500"
								/>
								<Button onClick={addTag} disabled={!currentTag.trim()} variant="outline">
									Add
								</Button>
							</div>
							{formData.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{formData.tags.map((tag, index) => (
										<Badge key={index} variant="secondary" className="flex items-center gap-1 text-sm px-3 py-1">
											#{tag}
											<X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
										</Badge>
									))}
								</div>
							)}
						</div>

						<Separator />

						<div className="space-y-3">
							<Label className="flex items-center gap-2 text-base font-medium">
								<AtSign className="h-4 w-4 text-gray-600" />
								Mentions
							</Label>
							<div className="flex gap-2">
								<Input
									placeholder="Mention someone..."
									value={currentMention}
									onChange={(e) => setCurrentMention(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault()
											addMention()
										}
									}}
									className="flex-1 focus-visible:ring-blue-500"
								/>
								<Button onClick={addMention} disabled={!currentMention.trim()} variant="outline">
									Add
								</Button>
							</div>
							{formData.mentions.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{formData.mentions.map((mention, index) => (
										<Badge key={index} variant="outline" className="flex items-center gap-1 text-sm px-3 py-1">
											@{mention}
											<X
												className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
												onClick={() => removeMention(mention)}
											/>
										</Badge>
									))}
								</div>
							)}
						</div>
					</div>
				)

			case 4:
				return (
					<div className="space-y-6">
						<div className="space-y-3">
							<Label className="flex items-center gap-2 text-base font-medium">
								{formData.visibility === "public" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
								Who can see this post?
							</Label>
							<div className="flex flex-col gap-4">
								<label className="inline-flex items-center">
									<input
										type="radio"
										name="visibility"
										value="public"
										checked={formData.visibility === "public"}
										onChange={(e) => handleInputChange("visibility", e.target.value)}
										className="form-radio h-4 w-4 text-green-600"
									/>
									<div className="flex items-center gap-2 ml-2">
										<Eye className="h-4 w-4 text-green-600" />
										<div>
											<p className="font-medium">Public</p>
											<p className="text-sm text-gray-500">Anyone can see this post</p>
										</div>
									</div>
								</label>

								<label className="inline-flex items-center">
									<input
										type="radio"
										name="visibility"
										value="connections"
										checked={formData.visibility === "connections"}
										onChange={(e) => handleInputChange("visibility", e.target.value)}
										className="form-radio h-4 w-4 text-yellow-600"
									/>
									<div className="flex items-center gap-2 ml-2">
										<EyeOff className="h-4 w-4 text-yellow-600" />
										<div>
											<p className="font-medium">Connections Only</p>
											<p className="text-sm text-gray-500">Only your connections can see this</p>
										</div>
									</div>
								</label>

								<label className="inline-flex items-center">
									<input
										type="radio"
										name="visibility"
										value="private"
										checked={formData.visibility === "private"}
										onChange={(e) => handleInputChange("visibility", e.target.value)}
										className="form-radio h-4 w-4 text-red-600"
									/>
									<div className="flex items-center gap-2 ml-2">
										<EyeOff className="h-4 w-4 text-red-600" />
										<div>
											<p className="font-medium">Private</p>
											<p className="text-sm text-gray-500">Only you can see this post</p>
										</div>
									</div>
								</label>
							</div>
						</div>


						<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
							<h4 className="font-semibold text-gray-800 mb-3">Post Summary</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
								<div className="flex items-center gap-3 justify-between bg-gray-50 rounded-lg">
									<span className="font-medium">Content</span>
									{formData.content.replace(/<[^>]*>/g, "").trim() ? (
										<Badge variant="outline" className="bg-green-100 text-green-700">
											Added
										</Badge>
									) : (
										<Badge variant="outline" className="bg-red-100 text-red-700">
											Not added
										</Badge>
									)}
								</div>

								<div className="flex items-center gap-3 justify-between bg-gray-50 rounded-lg">
									<span className="font-medium">Question</span>
									{formData.haveQuestion ? (
										<Badge variant="outline" className="bg-blue-100 text-blue-700">
											Yes
										</Badge>
									) : (
										<Badge variant="outline">No</Badge>
									)}
								</div>

								<div className="flex items-center gap-3 justify-between bg-gray-50 rounded-lg">
									<span className="font-medium">Images</span>
									<Badge variant="outline" className="min-w-[60px] text-center">
										{attachments.length} uploaded
									</Badge>
								</div>

								<div className="flex items-center gap-3 justify-between bg-gray-50 rounded-lg">
									<span className="font-medium">Tags</span>
									<Badge variant="outline" className="min-w-[60px] text-center">
										{formData.tags.length} added
									</Badge>
								</div>

								<div className="flex items-center gap-3 justify-between bg-gray-50 rounded-lg">
									<span className="font-medium">Mentions</span>
									<Badge variant="outline" className="min-w-[60px] text-center">
										{formData.mentions.length} added
									</Badge>
								</div>

								<div className="flex items-center gap-3 justify-between bg-gray-50 rounded-lg">
									<span className="font-medium">Visibility</span>
									<Badge variant="outline" className="capitalize">
										{formData.visibility}
									</Badge>
								</div>
							</div>
						</div>
					</div>
				)

			case 5: // Preview & Submit Section
				return (
					<div className="space-y-6">
						<PostPreview
							content={formData.content}
							attachments={attachments}
							question={formData.haveQuestion ? formData.question : null}
							tags={formData.tags}
							mentions={formData.mentions}
							visibility={formData.visibility}
						/>

						<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-900">
							<h4 className="font-semibold mb-2">Ready to post?</h4>
							<p className="text-sm text-blue-700">
								{`Review your Cear above and click submit when you're ready to share it with the community.`}
							</p>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<div className="cursor-pointer group">
					<div className="flex items-center gap-3 p-4 bg-white border-2 border-gray-100 hover:border-green-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
						<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-full group-hover:scale-110 transition-transform">
							<Edit className="h-5 w-5 text-green-600 group-hover:text-green-700" />
						</div>
						<div className="flex-1">
							<h3 className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
								{isReply ? "Reply to Post" : "Create New Cear"}
							</h3>
							<p className="text-sm text-gray-500">
								{isReply ? "Share your thoughts on this post" : "Share something with the community"}
							</p>
						</div>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-3xl h-[90vh] sm:max-h-[95vh] w-[95vw] sm:w-[90vw] overflow-y-auto p-2 sm:p-4 md:p-6" >
				<DialogTitle className="sr-only">{isReply ? "Reply to Cear" : "Create New Cear"}</DialogTitle>
				<Card className="w-full border-none shadow-none space-y-6">
					<CardHeader className="pb-4 p-0">
						<CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
							{isReply ? (
								<>
									<HelpCircle className="h-6 w-6 text-green-600" />
									Reply to Post
								</>
							) : (
								<>
									<Hash className="h-6 w-6 text-green-600" />
									Create New Cear
								</>
							)}
						</CardTitle>

						{/* Section Navigation */}
						<div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 sm:gap-0">
							<div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 sm:gap-0">
								<div className="flex flex-wrap justify-center sm:justify-start gap-2">
									{SECTIONS.map((section, index) => {
										const Icon = section.icon
										const isActive = index === currentSection
										const isCompleted = index < currentSection
										const isAccessible = index <= currentSection || (index === currentSection + 1 && canProceedToNext())

										return (
											<Button
												key={section.id}
												type="button"
												onClick={() => isAccessible && goToSection(index)}
												disabled={!isAccessible}
												variant="ghost"
												className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
												${isActive ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" : ""}
												${isCompleted ? "bg-green-50 text-green-700 hover:bg-green-100" : ""}
												${!isActive && !isCompleted && isAccessible
														? "text-gray-700 hover:bg-gray-100"
														: "text-gray-400 cursor-not-allowed"
													} `}
											>
												<Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : ""}`} />
												<span className="hidden sm:inline">{section.title}</span>
											</Button>
										)
									})}
								</div>
								<div className="text-sm text-gray-500 mt-2 sm:mt-0 whitespace-nowrap">
									Step {currentSection + 1} of {SECTIONS.length}
								</div>
							</div>
						</div>
						<Progress value={((currentSection + 1) / SECTIONS.length) * 100} className="mt-4 h-2 bg-gray-200" />
					</CardHeader>

					<CardContent className="p-0" >
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<div className="min-h-[300px]">{renderSectionContent()}</div>

					</CardContent>
					<DialogFooter className="p-0" >
						<div className="flex items-center justify-between pt-6 border-t border-gray-200 w-full">
							<Button
								type="button"
								variant="outline"
								onClick={prevSection}
								disabled={currentSection === 0}
								className="flex items-center gap-2 bg-transparent"
							>
								<ChevronLeft className="h-4 w-4" />
								Previous

							</Button>

							<div className="flex items-center gap-2">
								{currentSection < SECTIONS.length - 1 ? (
									<Button
										type="button"
										onClick={nextSection}
										disabled={!canProceedToNext()}
										className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
									>
										Next
										<ChevronRight className="h-4 w-4" />
									</Button>
								) : (
									<Button
										type="submit"
										onClick={onSubmit}
										disabled={isSubmitting || !canProceedToNext()}
										className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
										size="lg"
									>
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{isReply ? "Posting Reply..." : "Creating Post..."}
											</>
										) : (
											<>
												<Send className="h-4 w-4" />
												{isReply ? "Post Reply" : "Create Cear"}
											</>
										)}
									</Button>
								)}
							</div>
						</div>
					</DialogFooter>
				</Card>
			</DialogContent>
		</Dialog>
	)
}










