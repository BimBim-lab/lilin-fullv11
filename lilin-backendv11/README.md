# WeisCandle Backend API

This is the backend API for the WeisCandle aromatherapy candle workshop website.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see Environment Variables section)

3. Push database schema:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Server
PORT=5000
NODE_ENV=development

# CORS Origins (comma-separated for multiple origins)
CORS_ORIGINS=http://localhost:3000
```

## API Endpoints

### Blog Posts

- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get blog post by slug

### Contact

- `POST /api/contact` - Submit contact form

Example contact request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Workshop Inquiry",
  "message": "I'm interested in joining your workshop."
}
```

## Database Schema

The application uses PostgreSQL with the following tables:

- `users` - User authentication
- `blog_posts` - Blog content
- `contacts` - Contact form submissions

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── index.ts          # Application entry point
├── routes.ts         # API routes
├── storage.ts        # Database operations
└── schema.ts         # Database schema and validation
```

## Development

### Database Management

Use Drizzle Studio to manage your database:

```bash
npm run db:studio
```

### Error Handling

The API includes comprehensive error handling:

- Input validation with Zod
- Database error handling
- HTTP error responses
- Request logging

### CORS Configuration

The API is configured to accept requests from the frontend application. Update the CORS origins in the environment variables for production deployment.
