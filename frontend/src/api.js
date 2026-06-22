// All backend API calls are in this file.
// The base URL is "/api" which Vite proxies to http://localhost:5000

const BASE = '/api';

// Read JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Reusable helper for all authenticated JSON requests
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const signupUser = async (username, email, password) => {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

// ─── POSTS ───────────────────────────────────────────────────────────────────

export const getAllPosts = async () => {
  const res = await fetch(`${BASE}/posts`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load posts');
  return data; // { success, posts: [...] }
};

export const getUserPosts = async (userId) => {
  const res = await fetch(`${BASE}/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load user posts');
  return data; // { success, posts: [...] }
};

export const createPost = async (text, image) => {
  const form = new FormData();
  if (text) form.append('text', text);
  if (image) form.append('image', image);

  const res = await fetch(`${BASE}/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }, // No Content-Type for FormData
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create post');
  return data; // { success, post: {...} }
};

export const toggleLikePost = async (postId) => {
  const res = await fetch(`${BASE}/posts/${postId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to like post');
  return data; // { success, liked, post: {...} }
};

export const addComment = async (postId, text) => {
  const res = await fetch(`${BASE}/posts/${postId}/comment`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add comment');
  return data; // { success, post: {...} }
};

export const deletePost = async (postId) => {
  const res = await fetch(`${BASE}/posts/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete post');
  return data;
};