# Social Post App

A complete full-stack social posting application built with React, Node.js, Express, MongoDB and Material UI.

## Why this project is strong for companies

- Full-stack architecture: Separate backend API and frontend client.
- Real authentication with JWT and password hashing.
- Image upload support via ImageKit.
- Responsive UI using Material UI and React Router.
- Modern best practices: modular components, context-based auth, protected API routes.
- Good fit for companies looking for MERN-style experience and a production-ready portfolio piece.

## Features

- User signup and login with JWT authentication
- Protected feed and profile routes
- Create posts with text and optional images
- Like/unlike posts
- Add comments to posts
- View your own profile and delete your posts
- Clean UI with Material UI design system

## Tech stack

- Frontend: React, Vite, Material UI, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JSON Web Tokens (JWT)
- Uploads: ImageKit
- Utilities: dotenv, cors, bcrypt, multer

## Project structure

- `backend/` - API server, routes, controllers, and database connection
- `frontend/` - React application and UI components
- `backend/config/` - environment loader, database connector, ImageKit config
- `backend/models/` - Mongoose schemas for User and Post
- `frontend/src/` - React pages, components, context, and API helpers

## Setup instructions

### Prerequisites

- Node.js 14 or higher
- npm
- MongoDB instance or MongoDB Atlas
- ImageKit account for image uploads

### Backend setup

1. Open a terminal in `backend/`
2. Run `npm install`
3. Create a `.env` file in `backend/`
4. Add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

5. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000` by default.

### Frontend setup

1. Open a terminal in `frontend/`
2. Run `npm install`
3. Start the frontend app:

```bash
npm run dev
```

The frontend will run on the Vite development server (usually `http://localhost:5173`).

### Running the app

- Sign up or log in with a Gmail address
- Create posts with text and optional image uploads
- Like, comment, and delete posts from your profile

## API endpoints

### Auth

- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/login` - Authenticate and receive token

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/user/:userId` - Get posts for a specific user
- `POST /api/posts` - Create a post (image upload supported)
- `POST /api/posts/:id/like` - Like or unlike a post
- `POST /api/posts/:id/comment` - Add a comment
- `DELETE /api/posts/:id` - Delete a post


