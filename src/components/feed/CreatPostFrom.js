"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { Edit, FileText, ImageIcon, LetterText, MessageCircleQuestion, Newspaper, Video, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import Editor from '../Editor';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { textPostSchema, imagePostSchema, questionPostSchema, articlePostSchema } from '@/schemas/postSchemas';

export default function CreatPostFromTriger() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [postType, setPostType] = useState('');

	const openDialog = (type) => {
		setPostType(type);
		setIsDialogOpen(true);
	};

	return (
		<div className='flex justify-center bg-green-100 w-full rounded-xl p-4'>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<div className='w-full space-y-3'>
					<div className='w-full'>
						<DialogTrigger
							className={cn(buttonVariants({ variant: "secondary", }), "group rounded-md  w-full ")}
							onClick={() => openDialog('text')}
						>
							<span className="w-full rounded-full shadow-transparent border-none opacity-30 text-left  "
							> What's on your mind?</span>
						</DialogTrigger>
					</div>
					<div className=' grid grid-cols-3 gap-1 items-center '>
						<DialogTrigger
							className={cn(buttonVariants({ variant: "secondary" }), "group rounded-l-md ")}
							onClick={() => openDialog('question')}
						>
							<Edit />  Question
						</DialogTrigger>
						<DialogTrigger
							className={cn(buttonVariants({ variant: "secondary" }), "group  ")}
							onClick={() => openDialog('image')}
						>
							<ImageIcon /> Image
						</DialogTrigger>
						<DialogTrigger
							className={cn(buttonVariants({ variant: "secondary" }), "group  rounded-r-md ")}
							onClick={() => openDialog('article')}
						>
							<Newspaper /> Article
						</DialogTrigger>
					</div>
				</div>
				<DialogContent className="max-h-[90vh] p-0 gap-0 w-[95vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] max-w-[1200px]">
					<CreatPostFrom postType={postType} setIsDialogOpen={setIsDialogOpen} />
				</DialogContent>
			</Dialog>
		</div>
	);
}

const PostLayout = ({ children, footer, isLoading }) => (
	<div className='flex flex-col h-full'>
		<div className='flex-1 overflow-auto p-6'>
			{children}
		</div>
		<div className="sticky bottom-0 bg-background border-t">
			<DialogFooter className="p-4">
				{footer}
			</DialogFooter>
		</div>
	</div>
);

const CreatPostFrom = (props) => {
	const [postType, setPostType] = useState(props.postType);

	const renderPostForm = () => {
		switch (postType) {
			case 'text':
				return <TextPost setIsDialogOpen={props.setIsDialogOpen} />;
			case 'image':
				return <PostImage setIsDialogOpen={props.setIsDialogOpen} />;
			case 'question':
				return <PostQuestion setIsDialogOpen={props.setIsDialogOpen} />;
			case 'article':
				return <PostArticle setIsDialogOpen={props.setIsDialogOpen} />;
			default:
				return <TextPost setIsDialogOpen={props.setIsDialogOpen} />;
		}
	};

	return (
		<div className='flex flex-col h-full max-h-[90vh]'>
			<DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
				<DialogTitle>Create {postType} Post</DialogTitle>
				<DialogDescription>
					Share your thoughts, images, or questions with the community
				</DialogDescription>
			</DialogHeader>

			<div className="flex-1 overflow-auto">
				<div className="p-4 md:p-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 place-items-center">
						{[
							{ type: 'text', icon: LetterText, label: 'Text' },
							{ type: 'image', icon: ImageIcon, label: 'Image' },
							{ type: 'question', icon: MessageCircleQuestion, label: 'Question' },
							{ type: 'article', icon: FileText, label: 'Article' },
						].map(({ type, icon: Icon, label }) => (
							<Button
								key={type}
								variant={postType === type ? 'default' : 'outline'}
								onClick={() => setPostType(type)}
								className="w-full max-w-[200px] h-12 flex items-center justify-center gap-2"
							>
								<Icon className="h-5 w-5" />
								<span>{label}</span>
							</Button>
						))}
					</div>
					<hr className="my-4" />
					<div className="min-h-0 max-w-[1000px] mx-auto w-full">
						{renderPostForm()}
					</div>
				</div>
			</div>
		</div>
	);
};

const TextPost = ({ setIsDialogOpen }) => {
	const [content, setContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleTextPost = async () => {
		try {
			setIsLoading(true);
			setError('');
			
			// Validate content
			const validatedData = textPostSchema.parse({ content });
			
			const response = await axios.post("/api/post/text/create", validatedData);
			
			if (response.status === 201) {
				toast.success('Post created successfully');
				setIsDialogOpen(false);
				router.refresh(); // Refresh the feed
			}
		} catch (err) {
			if (err.name === 'ZodError') {
				setError(err.errors[0].message);
			} else {
				setError(err.response?.data?.message || 'Failed to create post');
				toast.error('Failed to create post');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PostLayout
			footer={
				<div className="flex items-center justify-between w-full gap-4">
					<div className="text-sm text-red-500 flex-1">{error}</div>
					<Button onClick={handleTextPost} disabled={isLoading}>
						{isLoading ? 'Posting...' : 'Post'}
					</Button>
				</div>
			}
		>
			<div className="min-h-[200px] max-w-[900px] mx-auto w-full">
				<Editor value={content} onChange={setContent} />
			</div>
		</PostLayout>
	);
};

const PostImage = ({ setIsDialogOpen }) => {
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [showEditor, setShowEditor] = useState(false);
	const [caption, setCaption] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleNextClick = () => {
		setShowEditor(true);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImagePreview(URL.createObjectURL(file));
			setImageFile(file);
		}
	};

	const handlePreviousClick = () => {
		setShowEditor(false);
	};

	const handleImagePost = async () => {
		try {
			setIsLoading(true);
			if (!imageFile) {
				throw new Error('Please select an image');
			}

			// Upload image
			const formData = new FormData();
			formData.append("file", imageFile);
			formData.append("folder", "post_images");
			
			const uploadRes = await axios.post("/api/uploadimage", formData);
			const imageUrl = uploadRes.data.url;

			// Validate post data
			const postData = { imageUrl, caption };
			const validatedData = imagePostSchema.parse(postData);

			// Create post
			const response = await axios.post("/api/post/image/create", validatedData);
			
			if (response.status === 201) {
				toast.success('Image posted successfully');
				setIsDialogOpen(false);
				router.refresh();
			}
		} catch (err) {
			if (err.name === 'ZodError') {
				setError(err.errors[0].message);
			} else {
				setError(err.response?.data?.message || 'Failed to upload image');
				toast.error('Failed to upload image');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PostLayout
			footer={
				<div className="flex justify-end gap-2">
					{showEditor && <Button variant="outline" onClick={handlePreviousClick}>Back</Button>}
					{imagePreview && !showEditor && <Button onClick={handleNextClick}>Add Caption</Button>}
					{showEditor && <Button onClick={handleImagePost}>Post Image</Button>}
				</div>
			}
		>
			{!showEditor ? (
				<div className="space-y-4">
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							className="cursor-pointer"
						/>
					</div>
					{imagePreview && (
						<div className="relative aspect-video rounded-lg overflow-hidden">
							<img
								src={imagePreview}
								alt="Preview"
								className="object-cover w-full h-full"
							/>
						</div>
					)}
				</div>
			) : (
				<Editor value={caption} onChange={setCaption} />
			)}
		</PostLayout>
	);
};

const PostQuestion = ({ setIsDialogOpen }) => {
	const [question, setQuestion] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleQuestionPost = async () => {
		try {
			setIsLoading(true);
			setError('');

			// Validate question
			const validatedData = questionPostSchema.parse({ question });

			const response = await axios.post('/api/post/question/create', validatedData);
			
			if (response.status === 201) {
				toast.success('Question posted successfully');
				setIsDialogOpen(false);
				router.refresh();
			}
		} catch (err) {
			if (err.name === 'ZodError') {
				setError(err.errors[0].message);
			} else {
				setError(err.response?.data?.message || 'Failed to post question');
				toast.error('Failed to post question');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PostLayout
			footer={
				<div className="flex items-center justify-between w-full">
					<div className="text-sm text-red-500">{error}</div>
					<Button onClick={handleQuestionPost} disabled={isLoading}>
						{isLoading ? 'Posting...' : 'Post Question'}
					</Button>
				</div>
			}
		>
			<Editor value={question} onChange={setQuestion} />
		</PostLayout>
	);
};

const PostArticle = ({ setIsDialogOpen }) => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleArticlePost = async () => {
		try {
			setIsLoading(true);
			setError('');

			// Validate article data
			const validatedData = articlePostSchema.parse({ title, content });

			const response = await axios.post('/api/post/article/create', validatedData);
			
			if (response.status === 201) {
				toast.success('Article posted successfully');
				setIsDialogOpen(false);
				router.refresh();
			}
		} catch (err) {
			if (err.name === 'ZodError') {
				setError(err.errors[0].message);
			} else {
				setError(err.response?.data?.message || 'Failed to post article');
				toast.error('Failed to post article');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PostLayout
			footer={
				<div className="flex items-center justify-between w-full">
					<div className="text-sm text-red-500">{error}</div>
					<Button onClick={handleArticlePost} disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Posting...
							</>
						) : (
							'Post Article'
						)}
					</Button>
				</div>
			}
		>
			<Input
				placeholder="Article Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full p-2 border rounded-md mb-4"
				disabled={isLoading}
			/>
			<div className={`relative ${isLoading ? 'opacity-50' : ''}`}>
				<Editor value={content} onChange={setContent} />
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-background/50">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				)}
			</div>
		</PostLayout>
	);
};
