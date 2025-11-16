# 🔐 Setup Credentials Guide

Your project requires credentials to connect to MongoDB and the LLM API. Follow these steps:

## Step 1: MongoDB Atlas Connection String

### Get Your Connection String:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Select your cluster (KYC-project cluster)
4. Click **"Connect"** button
5. Choose **"Drivers"** (Node.js)
6. Copy the connection string that looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Update `.env` File:
**File:** `backend/.env`

Replace this line:
```
MONGODB_URI=your_mongodb_uri_here
```

With your actual connection string:
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority
```

⚠️ **Important:** Make sure to:
- Replace `your_username` with your MongoDB username
- Replace `your_password` with your MongoDB password
- Keep the full string with `mongodb+srv://` prefix
- Keep the `?retryWrites=true&w=majority` suffix

---

## Step 2: Hugging Face API Key (for AI Summarization)

### Get Your API Key:
1. Go to [Hugging Face](https://huggingface.co)
2. Sign up or log in
3. Go to **Settings** → **Access Tokens**
4. Click **"Create new token"**
5. Give it a name (e.g., "KYC-Project")
6. Select **"Read"** permission
7. Copy the token

### Update `.env` File:
**File:** `backend/.env`

Replace this line:
```
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

With your actual API key:
```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 3: Verify the Configuration

Check that your `backend/.env` looks like this (with your actual values):

```dotenv
# Backend Environment Variables

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=kyc_database

# Data Storage (kept for backwards compatibility if needed)
DATA_DIR=./data

# LLM Configuration (Hugging Face)
LLM_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL=mistral-7b-instruct-v0.1

# Optional: Ollama (if running locally)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

---

## Step 4: Start the Backend

1. Open terminal in `backend` folder
2. Run:
   ```powershell
   npm run dev
   ```

You should see:
```
✅ MongoDB Atlas connected successfully
📊 Database: kyc_database
🚀 Server is running on http://localhost:5000
```

---

## Step 5: Start the Frontend

1. Open terminal in project root folder
2. Run:
   ```powershell
   npm run dev
   ```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 🧪 Test the Setup

1. Open browser to `http://localhost:5173`
2. Admin login:
   - Email: `admin@kyc.com`
   - Password: `admin123`
3. Submit a customer form
4. Check if approval buttons appear
5. Try approving a customer
6. Download PDF to verify everything works

---

## ⚠️ Troubleshooting

### Error: "Invalid scheme, expected connection string to start with mongodb://"
- **Cause:** `MONGODB_URI` is empty or invalid
- **Fix:** Check `backend/.env` and ensure you copied the full connection string

### Error: "MongoServerError: authentication failed"
- **Cause:** Wrong MongoDB username or password
- **Fix:** 
  1. Go to MongoDB Atlas
  2. Database Access → Find your user
  3. Edit user and reset password
  4. Update `.env` with correct credentials

### Error: "HuggingFace API connection failed"
- **Cause:** Invalid or missing API key
- **Fix:** 
  1. Check your API key in `backend/.env`
  2. Verify it starts with `hf_`
  3. Generate a new token if needed

### Error: "CORS error" or "Cannot reach backend"
- **Cause:** Backend not running or wrong port
- **Fix:** 
  1. Ensure backend is running on port 5000
  2. Check `backend/.env` has `FRONTEND_URL=http://localhost:5173`

---

## 🔒 Security Notes

- **Never commit `.env` file to GitHub** (it's already in `.gitignore`)
- **Never share your API keys or connection strings** in chat or with others
- **For production:** Use secure secrets management (AWS Secrets Manager, Azure Key Vault, etc.)

---

**Once credentials are set up, both frontend and backend will connect successfully! 🚀**
