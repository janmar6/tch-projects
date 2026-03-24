export const pocketBaseUrl =
	import.meta.env.POCKETBASE_URL ||
	import.meta.env.PUBLIC_POCKETBASE_URL ||
	'http://pocketbase:8090';

/** Use public URL for &lt;img src&gt; (browser); falls back to server URL. */
export function buildPocketBaseFileUrl(collection: string, recordId: string, fileName?: string) {
	if (!fileName) return '';
	const base =
		import.meta.env.PUBLIC_POCKETBASE_URL || import.meta.env.POCKETBASE_URL || 'http://localhost:8090';
	return `${base}/api/files/${collection}/${recordId}/${fileName}`;
}

export async function pbGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(path, pocketBaseUrl);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error(`PocketBase request failed: ${response.status} ${response.statusText}`);
	}

	return (await response.json()) as T;
}
