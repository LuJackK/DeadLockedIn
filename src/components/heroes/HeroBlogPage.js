import React from 'react';
import Post from '../community-blog/Post';

function HeroBlogPage({ posts }) {
	return (
		<div style={{ marginTop: '0' }}>
			<h3 style={{ fontWeight: 600, fontSize: '1.2em', marginBottom: '18px' }}>Related Blog Posts</h3>
			{posts.length > 0 ? (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
					{posts.map(post => (
						<Post key={post.id || post._id} {...post} />
					))}
				</div>
			) : (
				<div style={{ color: '#bdbdbd', fontSize: '1.08em', marginTop: '24px' }}>No related blog posts found.</div>
			)}
		</div>
	);
}

export default HeroBlogPage;
