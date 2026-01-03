'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// TODO: Implement actual login logic
		setTimeout(() => {
			setIsLoading(false);
			// Handle login success/error
		}, 1000);
	};

	return (
		<div className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16'>
			<div className='max-w-md w-full'>
				{/* Logo/Header */}
				<div className='text-center mb-8'>
					<Link
						href='/'
						className='inline-flex items-center gap-2 text-2xl md:text-3xl font-brand hover:opacity-80 transition-opacity mb-4'
						style={{
							color: 'var(--text-primary)',
							fontWeight: 600,
							letterSpacing: '0.5px',
						}}
					>
						<svg
							width='32'
							height='32'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<defs>
								<linearGradient
									id='goldGradient'
									x1='0'
									y1='0'
									x2='24'
									y2='24'
								>
									<stop offset='0%' stopColor='#e0d29a' />
									<stop offset='50%' stopColor='#c7b377' />
									<stop offset='100%' stopColor='#b5a467' />
								</linearGradient>
							</defs>
							<rect
								x='2.5'
								y='2.5'
								width='19'
								height='19'
								rx='5'
								stroke='url(#goldGradient)'
								strokeWidth='1.5'
							/>
							<path
								d='M8 16V8H11.5C13 8 14 9 14 10.5C14 12 13 13 11.5 13H9.5V16H8Z'
								fill='url(#goldGradient)'
							/>
							<path
								d='M15.5 8H17L14.5 16H13L15.5 8Z'
								fill='url(#goldGradient)'
							/>
						</svg>
						Poke Vault
					</Link>
					<h1
						className='font-brand text-3xl md:text-4xl font-bold mb-2'
						style={{ color: 'var(--text-primary)' }}
					>
						Welcome Back
					</h1>
					<p
						className='font-body text-sm'
						style={{ color: 'var(--text-muted)' }}
					>
						Sign in to access your collection
					</p>
				</div>

				{/* Login Form */}
				<div
					className='rounded-2xl p-8'
					style={{
						background: 'var(--bg-elevated)',
						border: '1px solid var(--border-default)',
						boxShadow: 'var(--shadow-md)',
					}}
				>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Email Field */}
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium mb-2'
								style={{ color: 'var(--text-secondary)' }}
							>
								Email
							</label>
							<input
								id='email'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='w-full px-4 py-3 rounded-xl transition-all duration-200'
								style={{
									background: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid var(--border-default)',
									color: 'var(--text-primary)',
								}}
								onFocus={(e) => {
									e.target.style.background = 'rgba(255, 255, 255, 0.08)';
									e.target.style.borderColor = 'var(--border-gold)';
									e.target.style.boxShadow =
										'0 0 0 2px var(--vault-gold-faint)';
								}}
								onBlur={(e) => {
									e.target.style.background = 'rgba(255, 255, 255, 0.05)';
									e.target.style.borderColor = 'var(--border-default)';
									e.target.style.boxShadow = 'none';
								}}
								placeholder='you@example.com'
							/>
						</div>

						{/* Password Field */}
						<div>
							<div className='flex items-center justify-between mb-2'>
								<label
									htmlFor='password'
									className='block text-sm font-medium'
									style={{ color: 'var(--text-secondary)' }}
								>
									Password
								</label>
								<Link
									href='/forgot-password'
									className='text-sm font-medium transition-colors duration-200 hover:opacity-80'
									style={{ color: 'var(--vault-gold)' }}
								>
									Forgot?
								</Link>
							</div>
							<input
								id='password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className='w-full px-4 py-3 rounded-xl transition-all duration-200'
								style={{
									background: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid var(--border-default)',
									color: 'var(--text-primary)',
								}}
								onFocus={(e) => {
									e.target.style.background = 'rgba(255, 255, 255, 0.08)';
									e.target.style.borderColor = 'var(--border-gold)';
									e.target.style.boxShadow =
										'0 0 0 2px var(--vault-gold-faint)';
								}}
								onBlur={(e) => {
									e.target.style.background = 'rgba(255, 255, 255, 0.05)';
									e.target.style.borderColor = 'var(--border-default)';
									e.target.style.boxShadow = 'none';
								}}
								placeholder='••••••••'
							/>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							disabled={isLoading}
							className='w-full py-3 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
							style={{
								background: isLoading
									? 'var(--vault-gold-soft)'
									: 'linear-gradient(135deg, var(--vault-gold), var(--vault-gold-dark))',
								color: 'var(--text-inverse)',
								border: 'none',
								boxShadow: isLoading
									? 'none'
									: '0 10px 22px rgba(199, 179, 119, 0.35)',
							}}
							onMouseEnter={(e) => {
								if (!isLoading) {
									e.currentTarget.style.boxShadow =
										'0 12px 28px rgba(199, 179, 119, 0.45)';
									e.currentTarget.style.transform = 'translateY(-1px)';
								}
							}}
							onMouseLeave={(e) => {
								if (!isLoading) {
									e.currentTarget.style.boxShadow =
										'0 10px 22px rgba(199, 179, 119, 0.35)';
									e.currentTarget.style.transform = 'translateY(0)';
								}
							}}
						>
							{isLoading ? 'Signing in...' : 'Sign In'}
						</button>
					</form>

					{/* Divider */}
					<div className='relative my-6'>
						<div
							className='absolute inset-0 flex items-center'
							style={{ borderTop: '1px solid var(--border-default)' }}
						>
							<span
								className='relative px-4 text-sm'
								style={{
									background: 'var(--bg-elevated)',
									color: 'var(--text-muted)',
								}}
							>
								OR
							</span>
						</div>
					</div>

					{/* Sign Up Link */}
					<div className='text-center'>
						<p
							className='text-sm'
							style={{ color: 'var(--text-muted)' }}
						>
							Don't have an account?{' '}
							<Link
								href='/signup'
								className='font-semibold transition-colors duration-200 hover:opacity-80'
								style={{ color: 'var(--vault-gold)' }}
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>

				{/* Back to Home */}
				<div className='text-center mt-6'>
					<Link
						href='/'
						className='inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-80'
						style={{ color: 'var(--text-muted)' }}
					>
						<svg
							className='w-4 h-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 19l-7-7 7-7'
							/>
						</svg>
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}

