# Next.js Blog

A modern full-stack blog application built with Next.js 14, featuring user authentication, post creation with media uploads, and deployment to Vercel.

## Features

- User registration and login
- Create public or private posts
- Upload images, videos, and audio files
- Responsive design with dark theme
- MongoDB for data storage
- Supabase Storage for media files
- Deployed on Vercel

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Storage**: Supabase Storage
- **Authentication**: JWT tokens
- **Deployment**: Vercel

## Prerequisites

- Node.js v20.10.0 or later
- Git
- MongoDB Atlas account (or local MongoDB)
- Supabase account

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ch19-deploy-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see below)

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/blog?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-secure-jwt-secret-here

# Supabase Storage
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_STORAGE_BUCKET=blog

# App
BASE_URL=http://localhost:3000
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Storage in your Supabase dashboard
3. Create a new bucket named `blog`
4. Make the bucket public (uncheck "Private bucket")
5. Go to Settings > API to get your project URL and service role key

### MongoDB Setup

1. Create a MongoDB Atlas cluster or use local MongoDB
2. Get your connection string
3. Update `DATABASE_URL` in `.env.local`

## Database Schema

The app uses MongoDB with the following collections:

- `users`: User accounts with username, email, password hash
- `posts`: Blog posts with title, content, media URLs, visibility

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET`
   - `BASE_URL` (set to your Vercel domain)
4. Deploy

### Docker Deployment

Build and run with Docker:

```bash
docker build \
  -t nextjs-blog \
  --build-arg "DATABASE_URL=your-mongo-url" \
  --build-arg "JWT_SECRET=your-jwt-secret" \
  --build-arg "SUPABASE_URL=your-supabase-url" \
  --build-arg "SUPABASE_SERVICE_ROLE_KEY=your-service-key" \
  --build-arg "SUPABASE_STORAGE_BUCKET=blog" \
  --build-arg "BASE_URL=http://localhost:3000" \
  .

docker run -p 3000:3000 nextjs-blog
```

## Usage

1. Register a new account or log in
2. Create posts with text content and optional media
3. View posts on the home page
4. Click post titles to view full posts with media

## API Routes

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/posts` - Get posts (with visibility filtering)
- `POST /api/v1/posts` - Create new post
- `POST /api/v1/upload` - Upload media files

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. See the book "Modern Full-Stack React Projects" for more details.