import React, { useState } from 'react';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!username || !password) {
			setError('Please enter both username and password.');
			return;
		}
		setError('');
		try {
			const res = await fetch('http://88.200.63.148:5002/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
				credentials: 'include' 
			});
			const data = await res.json();
			if (data.success) {
				// Optionally, set local state or redirect
				alert('Login successful!');
			} else {
				setError(data.error || 'Login failed.');
			}
		} catch (err) {
			setError('Server error.');
		}
	};

	return (
		<div style={{ background: '#23272f', color: '#eaeaea', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', padding: '32px', maxWidth: '400px', margin: '64px auto' }}>
			<h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 700 }}>Login</h2>
			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={e => setUsername(e.target.value)}
					style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#181818', color: '#eaeaea', fontSize: '1em' }}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#181818', color: '#eaeaea', fontSize: '1em' }}
				/>
				{error && <div style={{ color: '#ff6b6b', fontSize: '0.98em', textAlign: 'center' }}>{error}</div>}
				<button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#353a45', color: '#eaeaea', fontWeight: 600, fontSize: '1em', cursor: 'pointer', marginTop: '8px' }}>Login</button>
			</form>
			<div style={{ textAlign: 'center', marginTop: '24px' }}>
				<span style={{ color: '#bdbdbd', fontSize: '1em' }}>Don't have an account?</span>
				<br />
				<a href="/create-account" style={{ display: 'inline-block', marginTop: '10px', padding: '10px 24px', borderRadius: '8px', background: '#353a45', color: '#eaeaea', fontWeight: 600, textDecoration: 'none', fontSize: '1em', border: 'none', cursor: 'pointer' }}>Create Account</a>
			</div>
		</div>
	);
}

export default Login;
