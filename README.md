# CNG Cylinder Testing Portal

A comprehensive web application for managing CNG cylinder testing records, generating reports, and tracking overdue tests. Built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## 🚀 Features

*   **Dashboard**: Real-time overview of testing statistics, monthly performance charts, and critical overdue alerts.
*   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
*   **Record Management**: Add, view, edit, and filter testing records.
*   **Smart Alerts**: Automatically identifies vehicles with overdue tests (ignoring those already re-tested).
*   **Search & Filters**: Advanced search by vehicle number, customer name, date ranges, and more.
*   **Secure Authentication**: JWT-based authentication for admin access.
*   **User Management**: command-line script to easily add new admin users.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS, Framer Motion, Recharts, Lucide React
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Authentication**: JSON Web Tokens (JWT), Bcrypt

## 📦 Installation

### Prerequisites

*   Node.js (v14+)
*   MongoDB (Local or Atlas URL)

### 1. Clone the Repository

```bash
git clone https://github.com/chandan-bansal/cng-portal.git
cd cng-portal
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cng-portal
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

## 🚀 Usage

### Starting the Application

You need to run both the backend and frontend servers.

**1. Start Backend:**

```bash
cd server
node index.js
```

**2. Start Frontend:**

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

### Creating an Admin User

Since there is no public sign-up page, use the provided script to create your first admin user:

```bash
cd server
node create_user.js <username> <password>
```
Example: `node create_user.js admin password123`

## 📄 License

This project is licensed under the ISC License.
