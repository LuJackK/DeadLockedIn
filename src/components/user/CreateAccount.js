import React, { useState } from 'react';

function CreateAccount() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !username || !password) {
			setError('Please fill in all fields.');
			setSuccess('');
			return;
		}
		setError('');
		setSuccess('');
		// Call backend API to create account
		try {
			const res = await fetch('http://88.200.63.148:5002/api/create-account', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, username, password })
			});
			const data = await res.json();
			if (data.success) {
				setSuccess('Account created successfully! You can now log in.');
			} else {
				setError(data.error || 'Account creation failed.');
			}
		} catch (err) {
			console.error('Error creating account:', err);
			setError(err.message || 'An unexpected error occurred.');
		}
	};

	return (
		<div style={{ background: '#23272f', color: '#eaeaea', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', padding: '32px', maxWidth: '400px', margin: '64px auto' }}>
			<h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 700 }}>Create Account</h2>
			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#181818', color: '#eaeaea', fontSize: '1em' }}
				/>
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
				{success && <div style={{ color: '#4caf50', fontSize: '0.98em', textAlign: 'center' }}>{success}</div>}
				<button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#353a45', color: '#eaeaea', fontWeight: 600, fontSize: '1em', cursor: 'pointer', marginTop: '8px' }}>Create Account</button>
			</form>
		</div>
	);
}

export default CreateAccount;
