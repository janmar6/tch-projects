import { buildPocketBaseFileUrl, pbGet } from './pocketbase';

type ListResponse<T> = {
	items: T[];
};

type PostRecord = {
	id: string;
	title: string;
	slug: string;
	excerpt?: string;
	content?: string;
	coverImage?: string;
	published: boolean;
	publishedAt?: string;
};

type ProjectRecord = {
	id: string;
	name: string;
	slug: string;
	summary?: string;
	description?: string;
	images?: string[];
	repoUrl?: string;
	liveUrl?: string;
	featured?: boolean;
};

export type Post = PostRecord & { coverImageUrl: string };
export type Project = ProjectRecord & { imageUrl: string; imageUrls: string[] };

function toPost(record: PostRecord): Post {
	return {
		...record,
		coverImageUrl: buildPocketBaseFileUrl('posts', record.id, record.coverImage),
	};
}

function toProject(record: ProjectRecord): Project {
	const files = (record.images ?? []).filter(Boolean);
	const imageUrls = files.map((file) => buildPocketBaseFileUrl('projects', record.id, file));
	return {
		...record,
		imageUrl: imageUrls[0] ?? '',
		imageUrls,
	};
}

export async function getPosts(): Promise<Post[]> {
	try {
		const data = await pbGet<ListResponse<PostRecord>>('/api/collections/posts/records', {
			filter: 'published = true',
			sort: '-publishedAt',
		});
		return data.items.map(toPost);
	} catch (error) {
		console.warn('Unable to load posts from PocketBase:', error);
		return [];
	}
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
	try {
		const data = await pbGet<ListResponse<PostRecord>>('/api/collections/posts/records', {
			filter: `slug = "${slug}" && published = true`,
			sort: '-publishedAt',
			perPage: '1',
		});
		return data.items[0] ? toPost(data.items[0]) : null;
	} catch (error) {
		console.warn('Unable to load post by slug from PocketBase:', error);
		return null;
	}
}

export async function getProjects(): Promise<Project[]> {
	try {
		const data = await pbGet<ListResponse<ProjectRecord>>('/api/collections/projects/records', {
			sort: '-featured,-created',
		});
		return data.items.map(toProject);
	} catch (error) {
		console.warn('Unable to load projects from PocketBase:', error);
		return [];
	}
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
	try {
		const data = await pbGet<ListResponse<ProjectRecord>>('/api/collections/projects/records', {
			filter: `slug = "${slug}"`,
			perPage: '1',
		});
		return data.items[0] ? toProject(data.items[0]) : null;
	} catch (error) {
		console.warn('Unable to load project by slug from PocketBase:', error);
		return null;
	}
}
