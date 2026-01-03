import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './provider';
import Navbar from '@/components/Navbar';
import PixelBackground from '@/components/PixelBackground';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'PokeVault - Card Collection',
	description: 'Discover and collect cards with PokeVault',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<PixelBackground />
				<Providers>
					<Navbar />
					<main className='min-h-screen pt-16'>{children}</main>
				</Providers>
			</body>
		</html>
	);
}
