export default async function Home() {
	const res = await fetch('http://localhost:3001/api/health', {
		cache: 'no-store',
	});

	const data = await res.json();

	return (
		<main style={{ padding: 24 }}>
			<h1>PlayVault Web</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</main>
	);
}
