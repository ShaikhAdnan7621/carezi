// src\components\feed\CreatPostFrom.js
"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { Edit, FileText, ImageIcon, LetterText, MessageCircleQuestion, Newspaper, Video } from 'lucide-react';
import { Input } from '../ui/input';
import Editor from '../Editor';
import axios from 'axios';


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
				<DialogContent className='w-scree border h-screen lg:h-4/5 md:max-h-[90%] w-screen lg:w-4/5 lg:max-w-none flex flex-col '>
					<DialogTitle>Create a {postType} post</DialogTitle>
					<CreatPostFrom postType={postType} setIsDialogOpen={setIsDialogOpen} />
				</DialogContent>
			</Dialog>
		</div>
	);
}

const CreatPostFrom = (props) => {
	const [postType, setPostType] = useState(props.postType);

	const renderPostForm = () => {
		switch (postType) {
			case 'text':
				return <TextPost setIsDialogOpen={props.setIsDialogOpen} />;
			case 'image':
				return <PostImage />;
			case 'question':
				return <PostQuestion />;
			case 'article':
				return <PostArticle />;
			default:
				return <TextPost setIsDialogOpen={props.setIsDialogOpen} />;
		}
	};

	return (
		<div className=''>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
				<Button
					variant={postType === 'text' ? 'primary' : 'secondary'}
					onClick={() => setPostType('text')}
					className="transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-2"
				>
					<LetterText className="w-4 h-4" />
					Text
				</Button>
				<Button
					variant={postType === 'image' ? 'primary' : 'secondary'}
					onClick={() => setPostType('image')}
					className="transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-2"
				>
					<ImageIcon className="w-4 h-4" />
					Image
				</Button>
				<Button
					variant={postType === 'question' ? 'primary' : 'secondary'}
					onClick={() => setPostType('question')}
					className="transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-2"
				>
					<MessageCircleQuestion className="w-4 h-4" />
					Question
				</Button>
				<Button
					variant={postType === 'article' ? 'primary' : 'secondary'}
					onClick={() => setPostType('article')}
					className="transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-2"
				>
					<FileText className="w-4 h-4" />
					Article
				</Button>
			</div>
			<hr className='mb-6' />
			{renderPostForm()}
		</div>
	);
};

const TextPost = ({ setIsDialogOpen }) => {
	const [content, setContent] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleTextPost = async () => {
		try {
			const response = await axios.post("api/post/text/create", { content });
			setMessage(response.data.message);
			setError('');
			setContent('');
			setIsDialogOpen(false);
		} catch (error) {
			setError(error.message);
			setMessage('');
		}
	};

	return (
		<div>
			<Editor value={content} onChange={(content) => { setContent(content) }} />
			<Button className="mt-2" onClick={handleTextPost} >
				Post
			</Button>
			{message && <p className="text-green-500 mt-2">{message}</p>}
			{error && <p className="text-red-500 mt-2">{error}</p>}
		</div>
	);
};



const PostQuestion = () => {
	const [question, setQuestion] = useState('');
	const handleQuestionPost = async () => {
		const questionData = { question };
		try {
			const response = await axios.post('/api/post/question/create/', questionData);
			console.log(response.data.message);
			setQuestion('');
		}
		catch (error) {
			console.error('Error posting question:', error);
		}
	}
	return (
		<div>
			<Editor value={question} onChange={setQuestion} />
			<Button className="mt-2" onClick={handleQuestionPost} >Post Question</Button>
		</div>
	);
};



const PostImage = () => {
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [showEditor, setShowEditor] = useState(false);
	const [caption, setCaption] = useState('');

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
			const formData = new FormData();
			formData.append("file", imageFile);
			formData.append("folder", "post_images"); // You can change the folder name if needed
			const uploadRes = await axios.post("/api/uploadimage", formData);
			const imageUrl = uploadRes.data.url;
 			const response = await axios.post("/api/post/image/create", { imageUrl, caption });
			console.log(response.data.message);
 		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className='overflow-auto'>
			{!showEditor ? (
				<>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						className="w-full p-2 border rounded-md mb-4"
					/>
					{imagePreview && (
						<>
							<div className='overflow-auto h-64 w-full'>
								<img src={imagePreview} alt="Preview" className="mt-2 mx-auto h-auto rounded-md w-64" />
							</div>
							<div className="flex justify-end mt-2">
								<button onClick={handleNextClick}>Next</button>
							</div>
						</>
					)}
				</>
			) : (
				<>
					<Editor value={caption} onChange={setCaption} />
					<div className="flex justify-between mt-2">
						<button onClick={handlePreviousClick}>Previous</button>
						<button onClick={handleImagePost}>Post Image</button>
					</div>
				</>
			)}
		</div>
	);
};




const PostArticle = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');


	const handleArticlePost = async () => {
		const articleData = {
			title,
			content,
		};
		try {
			const response = await axios.post('/api/post/article/create', articleData);
			console.log(response.data.message);
			setTitle('');
			setContent('');
		} catch (error) {
			console.error('Error posting article:', error);
		}
	}
	return (
		<div>
			<Input
				placeholder="Article Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full p-2 border rounded-md mb-4"
			/>
			<Editor value={content} onChange={setContent} />
			<Button className="mt-2">Post Article</Button>
		</div>
	);
};
