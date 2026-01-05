# Finance Management System

A comprehensive full-stack finance management application built with React, Tailwind CSS, Node.js, and MongoDB.

## 🚀 Features

### 1. **Finance Management (Money In & Out)**
- Track income and expenses
- Categorize transactions
- Multiple payment methods support
- Financial summaries and reports
- Filter by date, type, and status

### 2. **Client Management**
- Complete client database
- Contact information management
- Client status tracking
- Revenue tracking per client
- Search and filter capabilities

### 3. **Projects & Tasks**
- Project lifecycle management
- Budget tracking
- Team member assignment
- Task management within projects
- Progress tracking
- Priority and status management

### 4. **Targets & Performance Tracking**
- Set revenue, project, and custom targets
- Track progress in real-time
- Multiple time periods (daily, weekly, monthly, quarterly, yearly)
- Visual progress indicators
- Performance analytics

### 5. **Files & Documents**
- Document management system
- Category-based organization
- Tag system for easy search
- File metadata tracking
- Secure document storage

### 6. **Dashboard**
- Real-time analytics
- Financial overview
- Revenue trends
- Active targets tracking
- Recent transactions
- Interactive charts and graphs

## 🎨 Design Features

- **Modern UI/UX**: Clean, premium design with smooth animations
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Gradients**: Professional color schemes with gradient accents
- **Interactive Components**: Hover effects, transitions, and smooth interactions
- **Data Visualization**: Charts and graphs using Recharts library

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API requests
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd finance-management-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Edit .env file with your settings
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-management
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd finance-management-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🚦 Getting Started

### First Time Setup

1. **Start MongoDB**:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

2. **Start Backend Server**:
```bash
cd backend
npm run dev
```

3. **Start Frontend**:
```bash
cd frontend
npm run dev
```

4. **Create an Account**:
- Navigate to `http://localhost:3000`
- Click "Sign up now"
- Fill in your details
- Start using the application!

### Demo Account
You can use these demo credentials to explore the application:
- Email: `demo@example.com`
- Password: `password123`

## 📱 Application Structure

```
finance-management-app/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/
│   └── package.json
└── README.md
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- Secure HTTP headers

## 🎯 Usage Examples

### Managing Finances
1. Navigate to "Finance" from the sidebar
2. Click "Add Transaction"
3. Fill in transaction details (income/expense)
4. View financial summaries and trends

### Creating Projects
1. Go to "Projects & Tasks"
2. Click "Add Project"
3. Assign client, set budget, and dates
4. Track progress and manage tasks

### Setting Targets
1. Visit "Targets & Performance"
2. Click "Add Target"
3. Set target type, value, and period
4. Monitor progress in real-time

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Finance
- `GET /api/finance` - Get all transactions
- `POST /api/finance` - Create transaction
- `PUT /api/finance/:id` - Update transaction
- `DELETE /api/finance/:id` - Delete transaction
- `GET /api/finance/summary/stats` - Get financial summary

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Targets
- `GET /api/targets` - Get all targets
- `POST /api/targets` - Create target
- `PUT /api/targets/:id` - Update target
- `DELETE /api/targets/:id` - Delete target

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      secondary: { /* your colors */ }
    }
  }
}
```

### Branding
- Update logo in `Layout.jsx`
- Change app name throughout the application
- Modify color gradients in components

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change ports in `.env` (backend) or `vite.config.js` (frontend)
- Kill existing processes on those ports

### Module Not Found Errors
- Run `npm install` in both frontend and backend directories
- Clear npm cache: `npm cache clean --force`

## 📈 Future Enhancements

- Real file upload functionality
- Email notifications
- PDF report generation
- Multi-currency support
- Team collaboration features
- Mobile app version
- Advanced analytics
- Export data functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for modern business management

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Recharts for beautiful charts
- All open-source contributors

---

**Note**: This is a demonstration project. For production use, implement additional security measures, proper file upload handling, and comprehensive testing.

