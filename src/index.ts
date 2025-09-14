import express from 'express';
import { config } from 'dotenv';
import { createLogger, format, transports } from 'winston';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// Load environment variables
config();

// Create Express app
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const USE_MONGO = process.env.USE_MONGO === 'true';

// Configure Winston logger
const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Database connection (optional)
let mongoConnected = false;
const connectDB = async () => {
  if (!USE_MONGO) {
    logger.info('USE_MONGO is not enabled. Skipping MongoDB connection.');
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.warn('MONGODB_URI not set. Using in-memory session store.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    mongoConnected = true;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error. Falling back to in-memory store.', { error: (error as Error).message });
  }
};

// Attempt DB connect (non-fatal)
connectDB();

// Security headers with CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    },
  },
  frameguard: { action: 'deny' },
  hsts: true,
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
}));

// View engine setup with dev/prod resolution
(() => {
  const candidates = [
    path.join(__dirname, '../views'), // when transpiled to dist/
    path.join(process.cwd(), 'src/views') // when running via ts-node-dev
  ];
  const viewDir = candidates.find(p => fs.existsSync(p)) || candidates[0];
  app.set('views', viewDir);
  app.set('view engine', 'ejs');
})();

// Middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration (Mongo-backed if available; otherwise MemoryStore)
(() => {
  const base: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  };
  const uri = process.env.MONGODB_URI;
  if (USE_MONGO && uri && mongoConnected) {
    base.store = MongoStore.create({ mongoUrl: uri, collectionName: 'sessions' });
  }
  app.use(session(base));
})();

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Mock user - In production, replace with database model
const users = [
  { id: '1', username: 'admin@lilith.eve', password: 'password', name: 'Admin User' }
];

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    const user = users.find(u => u.username === email);
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user);
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  const user = users.find(u => u.id === id);
  done(null, user || null);
});

// Authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Routes
app.get('/', isAuthenticated, (req, res) => {
  res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: req.query.error });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login?error=Invalid+credentials',
  failureFlash: false
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard',
    user: req.user
  });
});

// Health check endpoint (API)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: 'Internal Server Error',
    message: isProduction ? 'Something went wrong' : err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  const port = (process.env.PORT || 3000).toString();
  logger.info(`Server is running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Dashboard: http://localhost:${port}/dashboard`);
  logger.info(`Health check: http://localhost:${port}/health');
  
  if (process.env.NODE_ENV !== 'production') {
    logger.info('API Documentation: http://localhost:3000/docs');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
const shutdown = () => {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('Server has been stopped');
    if (mongoConnected) {
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app };
