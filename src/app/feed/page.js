"use client"
import CreatPostFromTriger from '@/components/feed/CreatPostFrom'
import MarkdownView from '@/components/view';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export default function page() {

    return (
        <div className="pt-5">
            <CreatPostFromTriger />
            <Feed />
        </div>
    )
}

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post('/api/post/all/read', { limit: 12, skip: 0 });
                setPosts(response.data.data);
            } catch (error) {
                console.error('Error fetching all posts:', error);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllPosts();
    }, []);

    if (loading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='w-full'>
            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 '>
                {posts.map((post) => (
                    <Card key={post._id} className='p-4 mb-4'>
                        <div className='flex items-center mb-2'>
                            <Avatar className='mr-2'>
                                <AvatarImage src={post.postBy.profilePic} alt={post.postBy.name} />
                                <AvatarFallback>{post.postBy.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='text-sm'>{post.postBy.name}</p>
                                <p className='text-sm text-gray-500'>{post.postBy.bio}</p>
                            </div>
                        </div>
                        {post.content && <MarkdownView content={post.content} />}
                        {post.imageUrl && <img src={post.imageUrl} alt="Post Image" className="mt-2 rounded-md" />}
                        {post.caption && <p className="text-sm mt-1">{post.caption}</p>}
                    </Card>
                ))}
            </div>
        </div>
    );
};