# Backend Integration Setup Guide

## Overview
The Mission Statement Analyzer now includes a complete backend system with user authentication, data persistence, and analytics tracking.

## 🗄️ Database Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a database called `mission_analyzer`
3. Update `.env.local` with your database URL:
```
DATABASE_URL="postgresql://username:password@localhost:5432/mission_analyzer?schema=public"
```

### Option 2: Supabase (Recommended)
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from Settings > Database
4. Update `.env.local`:
```
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres?schema=public"
```

### Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Optional: View your database
npx prisma studio
```

## 🔐 Authentication Setup

### Environment Variables
Add to `.env.local`:
```
JWT_SECRET=your_very_long_random_jwt_secret_here
```

### Features
- User registration and login
- Secure password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for security
- Automatic analysis saving for logged-in users

## 📊 Database Schema

### Users Table
- Stores user accounts with encrypted passwords
- Links to analyses and saved missions
- Supports email verification (ready for future)

### Analyses Table
- Stores complete AI analysis results
- Tracks scores, recommendations, and alternatives
- Links to users (optional for anonymous usage)
- Includes metadata like AI model used

### Email Captures Table
- Tracks email signups for reports
- Stores associated mission data
- Supports email campaign tracking

### Saved Missions Table
- Users can save favorite mission statements
- Add notes and organize missions
- Mark favorites for quick access

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Analyses
- `GET /api/analyses` - Get user's past analyses
- `POST /api/analyses` - Save new analysis
- `POST /api/analyze` - Analyze mission (auto-saves if logged in)

### Email Capture
- `POST /api/email-capture` - Save email for report delivery

## 📱 User Dashboard

Access at `/dashboard` to view:
- Analysis history and trends
- Performance statistics
- Saved mission statements
- Account management

## 🔄 Auto-Save Feature

When users are logged in:
- All analyses are automatically saved
- No additional action required
- Can review past analyses anytime
- Tracks improvement over time

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **HTTP-Only Cookies**: XSS protection
- **Database Indexes**: Query performance
- **Input Validation**: SQL injection prevention

## 📈 Analytics Ready

The system tracks:
- User engagement metrics
- Industry analysis trends
- Score distributions
- Popular mission patterns

## 🎯 Usage Examples

### Frontend Integration
```typescript
// Check if user is logged in
const response = await fetch('/api/analyses')
const { analyses } = await response.json()

// Register new user
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    firstName: 'John',
    company: 'Acme Corp'
  })
})
```

### Database Queries
```typescript
// Get user's best performing analyses
const analyses = await prisma.analysis.findMany({
  where: { 
    userId: user.id,
    overallScore: { gte: 80 }
  },
  orderBy: { overallScore: 'desc' }
})
```

## 🚧 Development vs Production

### Development
- Uses local database or Supabase
- JWT secret can be simple
- Debug logging enabled

### Production
- Requires secure database connection
- Strong JWT secret (use crypto.randomBytes)
- HTTPS-only cookies
- Rate limiting recommended

## 📝 Next Steps

1. Set up your database using one of the options above
2. Run the migrations to create tables
3. Update your environment variables
4. Test the authentication flow
5. Try saving an analysis while logged in
6. Visit `/dashboard` to see your data

The backend is now fully functional and ready for production use!