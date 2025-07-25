# ✍️ Postify — Fullstack Post Sharing App (Node.js + Express + MongoDB)

Welcome to **Postify** — a modern backend web app that allows users to:
- 👤 Sign up and log in with secure authentication
- ✍️ Create, edit, and delete posts
- ❤️ Like/unlike posts
- 🔐 Protect routes using JWT + Cookies
- 🎨 Enjoy a sleek dark-themed UI with Tailwind CSS

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Templating Engine**: EJS
- **Authentication**: JWT + bcrypt + Cookies
- **UI Styling**: Tailwind CSS
- **Flash Messages**: express-flash-message
- **File Structure**: MVC-inspired

---

## 🧠 Features Overview

| Feature          | Description |
|------------------|-------------|
| 🔐 Auth          | Secure Sign Up & Login using JWT (stored in HTTP-only cookies) |
| 🧂 Hashed Passwords | Passwords stored using bcrypt (with salting) |
| 📝 CRUD Posts     | Create, Edit, Delete your own posts |
| ❤️ Likes         | Users can like/unlike any post |
| 👥 User-Post Link | MongoDB ObjectId referencing (populate used) |
| 🧼 Flash Messages | Displays messages on login/register/logout |
| 🛡️ Protected Routes | Only logged-in users can access certain routes |

---

## 📁 Project Folder Structure

```
postify/
│
├── models/
│   ├── usermodel.js      // User schema
│   └── postmodel.js      // Post schema
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── profile.ejs
│
├── public/
│   └── styles.css        // Optional Tailwind or custom styles
│
├── app.js                // Main server file
├── .env                  // Environment config
├── package.json
└── README.md             // You're reading it!
```

---

## 🛠 Installation & Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/postify.git
cd postify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File `.env`

```
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/postify
JWT_SECRET=yourSuperSecretKey
```

### 4. Run the App

```bash
npm start
```

Then open in browser:

```
http://localhost:3000
```

---

## 📦 Main Dependencies

```json
"dependencies": {
  "bcrypt": "^5.1.0",
  "cookie-parser": "^1.4.6",
  "dotenv": "^16.1.4",
  "ejs": "^3.1.9",
  "express": "^4.18.2",
  "express-flash-message": "^3.0.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^7.3.4"
}
```

---

## ✨ Key Functional Code Highlights

### 🔐 Password Hashing

```js
const hashPassword = await bcrypt.hash(password, 10)
```

### 🔐 JWT Token Creation & Storage in Cookie

```js
const token = jwt.sign({ email, userid: user._id }, process.env.JWT_SECRET)
res.cookie("token", token, { httpOnly: true })
```

### ✅ Route Protection Middleware

```js
function protectRoute(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.send("Invalid Token. Please login again.");
  }
}
```

### 🔁 Like Toggle Logic

```js
if (!post.likes.includes(req.user.userid)) {
  post.likes.push(req.user.userid)
} else {
  post.likes.splice(post.likes.indexOf(req.user.userid), 1)
}
await post.save()
```

---

## 🧪 Example Routes

| Route              | Description                     |
|-------------------|---------------------------------|
| `GET /`           | Homepage                        |
| `GET /register`   | Render signup form              |
| `POST /register`  | Register new user               |
| `GET /login`      | Render login form               |
| `POST /login`     | Login and set token cookie      |
| `GET /profile`    | Protected page with user posts  |
| `POST /post`      | Create new post                 |
| `GET /like/:id`   | Toggle like on a post           |
| `GET /logout`     | Clear cookie and logout         |
| `GET /delete/:id` | Delete post + remove from user  |
| `POST /update/:id`| Update a post’s content         |

---

## 💡 Flash Messages Example (Login Success/Fail)

```js
req.flash("error", "Incorrect password")
req.flash("success", "Logged in successfully")
```

Used in EJS template:
```ejs
<% if (messages.error) { %>
  <p class="text-red-500"><%= messages.error %></p>
<% } %>
```

---

## 🔐 Authentication Flow

1. User signs up → Password is hashed → JWT token is generated
2. Token is stored in cookie (httpOnly) for protection
3. Protected routes check for token in `req.cookies.token`
4. If token is valid, user can access profile/posts etc.

---

## 🧼 Password Comparison at Login

```js
const isMatch = await bcrypt.compare(req.body.password, user.password)
```

---

## 🧠 MongoDB Association (Reference)

**User Schema**
```js
posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
```

**Post Schema**
```js
user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
```

Used with `.populate("user")` or `.populate("posts")` to fetch relational data.

---

## 📈 Future Improvements

- Add comments system 🗨️
- REST API version for frontend integration 🔌
- User profile images/avatar upload
- Post tags & filtering
- Admin panel

---

## 🙌 Author

Built with 💙 by [Muhammad] https://github.com/Muhammad-BinMushtaq

---

## 📜 License

MIT License. Free to use, fork, and modify!

---
