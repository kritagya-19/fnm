# Quick Setup Guide

Follow these steps to get the Finance Management System up and running quickly.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v14+): `node --version`
- ✅ MongoDB installed: `mongod --version`
- ✅ npm or yarn: `npm --version`

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd finance-management-app/backend
npm install
```

Expected output: All packages installed successfully.

### 2. Start MongoDB

**Windows:**
```bash
# Open a new terminal and run:
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

Keep this terminal open while using the application.

### 3. Start Backend Server

```bash
# In the backend directory
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

Keep this terminal open.

### 4. Install Frontend Dependencies

Open a new terminal:

```bash
cd finance-management-app/frontend
npm install
```

### 5. Start Frontend

```bash
npm run dev
```

Expected output:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### 6. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 7. Create Your Account

1. Click on "Sign up now"
2. Fill in your details:
   - Name: Your Name
   - Email: your@email.com
   - Password: (minimum 6 characters)
3. Click "Sign Up"

You'll be automatically logged in and redirected to the dashboard!

## Common Issues and Solutions

### Issue: "MongoDB connection failed"
**Solution:** 
- Make sure MongoDB is running
- Check if port 27017 is available
- Restart MongoDB service

### Issue: "Port 5000 already in use"
**Solution:**
- Change the port in `backend/.env` file
- Or stop the process using port 5000

### Issue: "Port 3000 already in use"
**Solution:**
- The frontend will automatically suggest a different port
- Or stop the process using port 3000

### Issue: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Quick Test Checklist

After setup, verify these features work:

- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Dashboard displays correctly
- [ ] Can create a new client
- [ ] Can add a transaction
- [ ] Can create a project
- [ ] Can set a target
- [ ] Can add a document

## Development Tips

### Backend Development
- API runs on: `http://localhost:5000`
- Test endpoints with Postman or curl
- Check console for errors

### Frontend Development
- Hot reload is enabled
- Changes reflect immediately
- Check browser console for errors

### Database
- View data with MongoDB Compass
- Connect to: `mongodb://localhost:27017/finance-management`

## Next Steps

1. **Explore the Features**: Try creating clients, projects, and transactions
2. **Customize**: Modify colors in `tailwind.config.js`
3. **Add Data**: Populate with your business information
4. **Review Code**: Check the models and routes for customization

## Need Help?

- Check the main README.md for detailed documentation
- Review the troubleshooting section
- Check console logs for specific errors

## Production Deployment

For production deployment:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set environment variables properly
3. Use a process manager like PM2 for Node.js
4. Set up a reverse proxy (Nginx)
5. Use a production MongoDB instance
6. Enable HTTPS
7. Set up proper authentication secrets

---

**Ready to manage your finances like a pro! 🚀**

