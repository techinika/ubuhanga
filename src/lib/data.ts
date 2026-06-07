// src/lib/data.ts
// Placeholder data — swap for Firestore calls in production

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  publishedAt: string;
  slug: string;
  playlistId?: string;
  tags?: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  slug: string;
  tags: string[];
  youtubePlaylistId?: string;
}

export const categories = [
  'All', 'React', 'Node.js', 'Python', 'DevOps', 'Databases', 'Git', 'TypeScript', 'Linux', 'APIs',
];

export const videos: Video[] = [
  {
    id: '1',
    title: 'Build a REST API with Node.js and Express from Scratch',
    description: 'Learn how to build a complete REST API using Node.js and Express. Covers routing, middleware, error handling, authentication, and database integration with PostgreSQL.',
    youtubeId: 'fgTGADljAeg',
    thumbnail: 'https://img.youtube.com/vi/fgTGADljAeg/maxresdefault.jpg',
    duration: '42:18',
    views: '12.4K',
    category: 'Node.js',
    publishedAt: '2024-03-15',
    slug: 'build-rest-api-nodejs-express',
    playlistId: 'p1',
    tags: ['Node.js', 'Express', 'REST', 'API', 'Backend'],
  },
  {
    id: '2',
    title: 'React Hooks Explained: useState, useEffect & useContext',
    description: 'A deep dive into React Hooks — useState for state management, useEffect for side effects, and useContext for avoiding prop drilling. Includes practical examples.',
    youtubeId: 'dpw9EHDh2bM',
    thumbnail: 'https://img.youtube.com/vi/dpw9EHDh2bM/maxresdefault.jpg',
    duration: '35:04',
    views: '9.1K',
    category: 'React',
    publishedAt: '2024-02-20',
    slug: 'react-hooks-explained',
    playlistId: 'p1',
    tags: ['React', 'Hooks', 'useState', 'useEffect', 'Frontend'],
  },
  {
    id: '3',
    title: 'Introduction to Docker: Containers for Beginners',
    description: 'Get started with Docker and containerization. Learn about images, containers, Dockerfiles, docker-compose, and how to containerize a web application step by step.',
    youtubeId: 'pTFZFxd5sRs',
    thumbnail: 'https://img.youtube.com/vi/pTFZFxd5sRs/maxresdefault.jpg',
    duration: '58:22',
    views: '21.7K',
    category: 'DevOps',
    publishedAt: '2024-01-10',
    slug: 'intro-to-docker-containers',
    playlistId: 'p2',
    tags: ['Docker', 'Containers', 'DevOps', 'Dockerfile'],
  },
  {
    id: '4',
    title: 'PostgreSQL Full Course — From Zero to Pro',
    description: 'Master PostgreSQL from basics to advanced. Covers SQL queries, indexes, joins, transactions, window functions, and performance tuning.',
    youtubeId: 'qw--VYLpxG4',
    thumbnail: 'https://img.youtube.com/vi/qw--VYLpxG4/maxresdefault.jpg',
    duration: '1:14:09',
    views: '7.3K',
    category: 'Databases',
    publishedAt: '2023-12-05',
    slug: 'postgresql-full-course',
    playlistId: 'p4',
    tags: ['PostgreSQL', 'SQL', 'Databases', 'Backend'],
  },
  {
    id: '5',
    title: 'Python for Automation: Scripts That Save You Hours',
    description: 'Learn Python automation with practical scripts. File handling, web scraping, API automation, scheduled tasks, and working with CSV/JSON data.',
    youtubeId: 's3LvV-KJlXk',
    thumbnail: 'https://img.youtube.com/vi/s3LvV-KJlXk/maxresdefault.jpg',
    duration: '29:47',
    views: '15.9K',
    category: 'Python',
    publishedAt: '2023-11-14',
    slug: 'python-for-automation',
    playlistId: 'p3',
    tags: ['Python', 'Automation', 'Scripting', 'CLI'],
  },
  {
    id: '6',
    title: 'Git & GitHub: The Complete Workflow Guide',
    description: 'Everything you need to know about Git and GitHub. Branching strategies, pull requests, rebasing, conflict resolution, and team collaboration workflows.',
    youtubeId: 'RGOj5yH7evk',
    thumbnail: 'https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg',
    duration: '47:30',
    views: '33.2K',
    category: 'Git',
    publishedAt: '2023-10-22',
    slug: 'git-github-complete-workflow',
    tags: ['Git', 'GitHub', 'Version Control', 'DevOps'],
  },
  {
    id: '7',
    title: 'TypeScript for React Developers',
    description: 'Learn how to use TypeScript effectively in React applications. Typed props, generic components, event handlers, and advanced type patterns.',
    youtubeId: 'Z3qZ7sQd8lM',
    thumbnail: 'https://img.youtube.com/vi/Z3qZ7sQd8lM/maxresdefault.jpg',
    duration: '38:15',
    views: '8.7K',
    category: 'TypeScript',
    publishedAt: '2023-09-18',
    slug: 'typescript-for-react-devs',
    playlistId: 'p1',
    tags: ['TypeScript', 'React', 'Types', 'Frontend'],
  },
  {
    id: '8',
    title: 'Linux Command Line for Developers',
    description: 'Essential Linux commands every developer should know. File operations, process management, SSH, permissions, and shell scripting basics.',
    youtubeId: 'oxuRxtOuDnc',
    thumbnail: 'https://img.youtube.com/vi/oxuRxtOuDnc/maxresdefault.jpg',
    duration: '52:08',
    views: '18.2K',
    category: 'Linux',
    publishedAt: '2023-08-05',
    slug: 'linux-command-line-for-devs',
    playlistId: 'p2',
    tags: ['Linux', 'CLI', 'Terminal', 'DevOps'],
  },
  {
    id: '9',
    title: 'REST API Design Best Practices',
    description: 'Design RESTful APIs that scale. Resource naming, status codes, pagination, HATEOAS, versioning, and documentation with OpenAPI.',
    youtubeId: 'hdw2uK0sj6c',
    thumbnail: 'https://img.youtube.com/vi/hdw2uK0sj6c/maxresdefault.jpg',
    duration: '31:22',
    views: '6.5K',
    category: 'APIs',
    publishedAt: '2023-07-12',
    slug: 'rest-api-design-best-practices',
    tags: ['APIs', 'REST', 'Design', 'Backend'],
  },
  {
    id: '10',
    title: 'React State Management with Redux Toolkit',
    description: 'Modern state management with Redux Toolkit. Create slices, async thunks, and integrate with React components for predictable state.',
    youtubeId: '9zySeP5vH3c',
    thumbnail: 'https://img.youtube.com/vi/9zySeP5vH3c/maxresdefault.jpg',
    duration: '44:50',
    views: '11.3K',
    category: 'React',
    publishedAt: '2023-06-20',
    slug: 'react-state-management-redux-toolkit',
    playlistId: 'p1',
    tags: ['React', 'Redux', 'State Management', 'Frontend'],
  },
  {
    id: '11',
    title: 'CI/CD Pipelines with GitHub Actions',
    description: 'Automate testing, building, and deployment using GitHub Actions. Matrix builds, caching, environments, and deploying to cloud platforms.',
    youtubeId: 'R8_veQiYBjI',
    thumbnail: 'https://img.youtube.com/vi/R8_veQiYBjI/maxresdefault.jpg',
    duration: '41:36',
    views: '14.1K',
    category: 'DevOps',
    publishedAt: '2023-05-08',
    slug: 'ci-cd-pipelines-github-actions',
    playlistId: 'p2',
    tags: ['CI/CD', 'GitHub Actions', 'DevOps', 'Automation'],
  },
  {
    id: '12',
    title: 'Python OOP: Classes, Inheritance & Magic Methods',
    description: 'Object-oriented programming in Python. Classes, inheritance, polymorphism, dunder methods, properties, and abstract base classes.',
    youtubeId: 'Ej_02ICOIgs',
    thumbnail: 'https://img.youtube.com/vi/Ej_02ICOIgs/maxresdefault.jpg',
    duration: '36:44',
    views: '10.8K',
    category: 'Python',
    publishedAt: '2023-04-15',
    slug: 'python-oop-classes-inheritance',
    playlistId: 'p3',
    tags: ['Python', 'OOP', 'Classes', 'Backend'],
  },
];

export const playlists: Playlist[] = [
  {
    id: 'p1',
    title: 'Full-Stack Web Development',
    description: 'Build complete web applications from frontend to backend, covering HTML, CSS, JS, Node, and databases.',
    videoCount: 4,
    thumbnail: 'https://img.youtube.com/vi/fgTGADljAeg/maxresdefault.jpg',
    slug: 'full-stack-web-development',
    tags: ['HTML', 'CSS', 'Node.js', 'React'],
  },
  {
    id: 'p2',
    title: 'DevOps & Cloud Fundamentals',
    description: 'Learn Docker, CI/CD pipelines, and cloud deployment strategies for modern software teams.',
    videoCount: 3,
    thumbnail: 'https://img.youtube.com/vi/pTFZFxd5sRs/maxresdefault.jpg',
    slug: 'devops-cloud-fundamentals',
    tags: ['Docker', 'Linux', 'CI/CD', 'AWS'],
  },
  {
    id: 'p3',
    title: 'Python Mastery Series',
    description: 'From Python basics to advanced topics like decorators, async/await, and building real-world projects.',
    videoCount: 2,
    thumbnail: 'https://img.youtube.com/vi/s3LvV-KJlXk/maxresdefault.jpg',
    slug: 'python-mastery-series',
    tags: ['Python', 'OOP', 'Automation', 'APIs'],
  },
  {
    id: 'p4',
    title: 'Database Design & SQL',
    description: 'Master relational databases, schema design, query optimization, and ORMs.',
    videoCount: 1,
    thumbnail: 'https://img.youtube.com/vi/qw--VYLpxG4/maxresdefault.jpg',
    slug: 'database-design-sql',
    tags: ['SQL', 'PostgreSQL', 'MongoDB', 'ORM'],
  },
];

export function getVideoBySlug(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

export function getPlaylistBySlug(slug: string): Playlist | undefined {
  return playlists.find((p) => p.slug === slug);
}

export function getVideosByPlaylist(playlistId: string): Video[] {
  return videos.filter((v) => v.playlistId === playlistId);
}

export function getPlaylistForVideo(playlistId?: string): Playlist | undefined {
  if (!playlistId) return undefined;
  return playlists.find((p) => p.id === playlistId);
}
