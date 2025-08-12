import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Post from './Post';

function BlogPage() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchPosts() {
			try {
				const res = await fetch('http://88.200.63.148:5002/api/blog/all');
				const data = await res.json();
				if (data.success) {
					setPosts(data.posts);
				}
			} catch (err) {
				console.error('Error fetching posts:', err);
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	}, []);

	return (
		<div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', background: '#23272f', borderRadius: '18px', color: '#eaeaea', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
			<h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 700 }}>Community Blog</h2>
			<button
				style={{ marginBottom: '24px', padding: '12px 24px', borderRadius: '8px', background: '#353a45', color: '#eaeaea', fontWeight: 600, fontSize: '1em', border: 'none', cursor: 'pointer' }}
				onClick={() => navigate('/blog/create')}
			>
				Create Post
			</button>
			{loading ? (
				<div style={{ textAlign: 'center', color: '#bdbdbd' }}>Loading posts...</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
								{posts.map(post => (
									<Post
										title={post.title}
										content={post.content}
										author={post.author}
										published_on={post.published_on}
										tags={post.tags}
                                        image_url={post.image_url}
									/>
								))}
				</div>
			)}
		</div>
	);
}

export default BlogPage;
