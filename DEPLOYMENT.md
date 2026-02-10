# Deployment Guide

This guide explains how to deploy the **CNG Portal** to the web using free tier services: **MongoDB Atlas** (Database), **Render** (Backend), and **Vercel** (Frontend).

---

## 1. Database Setup (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free account and build a new **Shared Cluster** (free tier).
3.  Create a database user (username and password).
4.  Adding your IP address to the whitelist (or allow all IPs `0.0.0.0/0` for easiest access).
5.  Click **Connect** -> **Connect your application**.
6.  Copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).
    *   *You will need this URI for the backend deployment.*

---

## 2. Backend Deployment (Render)

1.  Push your latest code to GitHub.
2.  Sign up at [Render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `server`
    *   **Name**: `cng-portal-api` (or similar)
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
6.  **Environment Variables**:
    *   Scroll down to "Environment Variables" and add:
        *   `MONGO_URI`: (Paste your MongoDB Atlas connection string from Step 1)
        *   `JWT_SECRET`: (Enter a strong secret key for authentication)
        *   `PORT`: `10000` (Render's default port, or just leave it)
7.  Click **Create Web Service**.
8.  Once deployed, copy your backend URL (e.g., `https://cng-portal-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1.  Sign up at [Vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Settings**:
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `client`.
5.  **Environment Variables**:
    *   Add a new variable:
        *   **Name**: `VITE_API_URL`
        *   **Value**: (Paste your Render Backend URL from Step 2, e.g., `https://cng-portal-api.onrender.com`)
    *   *Note: Do not add a trailing slash `/`.*
6.  Click **Deploy**.

---

## 4. Final Verification

1.  Visit your new Vercel URL (e.g., `https://cng-portal.vercel.app`).
2.  Try to log in.
    *   *Note: Since this is a fresh database, you will need to create a user first.*
    *   **Issue**: You can't run the `create_user.js` script on Render directly easily.
    *   **Solution**:
        *   Connect to your MongoDB Atlas cluster from your **local machine** (update your local `.env` with the Atlas URI).
        *   Run `node create_user.js admin password123` locally.
        *   This will create the user in the cloud database.
        *   Now you can log in on the deployed website!
