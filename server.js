import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Job from './models/Job.js';
import User from './models/User.js';
import { getMatchedJobs } from './utils/matchingLogic.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(session({
    secret: 'matchme_super_secret_key_123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use((req, res, next) => {
    if ((req.path === '/' || req.path === '/index.html') && !req.session.userId) {
        return res.redirect('/login.html');
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
const MONGODB_URI = 'mongodb://127.0.0.1:27017/jobPortal';
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('\n SUCCESS: Connected to MongoDB Database!');
        console.log(` Connect in MongoDB Compass using: ${MONGODB_URI}\n`);
        const count = await Job.countDocuments();
        const sampleJob = await Job.findOne();
        if (count < 6 || (sampleJob && (!sampleJob.projectKeywords || sampleJob.projectKeywords.length === 0))) {
            await Job.deleteMany({});
            const initialJobs = [
                { title: "Data Analyst", description: "Analyze data using Python and SQL to uncover insights.", requiredSkills: ["Python", "SQL"], projectKeywords: ["Dashboard", "Pipeline", "Analysis", "ETL", "Data Cleaning"] },
                { title: "Prompt Engineer", description: "Design prompts using AI and NLP techniques to optimize LLM outputs.", requiredSkills: ["AI", "NLP"], projectKeywords: ["LLM", "Chatbot", "Generative AI", "GPT", "Prompt", "Fine-Tuning"] },
                { title: "Full Stack Developer", description: "Build scalable web applications using modern Javascript ecosystem.", requiredSkills: ["Node.js", "Express", "MongoDB"], projectKeywords: ["Web App", "E-commerce", "Portfolio", "Clone", "Frontend", "Backend"] },
                { title: "Backend Developer", description: "Develop and maintain server-side logic and databases.", requiredSkills: ["Node.js", "Java", "Python", "SQL"], projectKeywords: ["API", "Microservices", "System Design", "Database", "Authentication"] },
                { title: "AI Engineer", description: "Design and implement scalable AI models and machine learning infrastructure.", requiredSkills: ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"], projectKeywords: ["Recommendation", "Computer Vision", "NLP", "Neural Network", "Classification"] },
                { title: "AI Analyst", description: "Evaluate and interpret AI model testing results to improve performance and business decisions.", requiredSkills: ["Data Analysis", "Machine Learning", "Statistics"], projectKeywords: ["Model Evaluation", "A/B Testing", "Data Visualization", "Metrics", "Insights"] }
            ];
            await Job.insertMany(initialJobs);
            console.log('Database pre-populated with 6 initial jobs.');
        }
    })
    .catch((error) => console.error("Unable to connect to MongoDB:", error));
app.get('/', (req, res) => {
    res.redirect('/login.html');
});
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username or email already taken.' });
        }
        const user = new User({ username, email, password });
        await user.save();
        req.session.userId = user._id;
        console.log(`New user registered: ${username} (${email})`);
        res.status(201).json({ success: true, message: 'Account created successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }
        req.session.userId = user._id;
        console.log(`User logged in: ${username}`);
        res.status(200).json({ success: true, message: 'Login successful!' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
});
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to logout.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
});
app.post('/match', async (req, res) => {
    try {
        const userProfile = req.body;
        const allJobs = await Job.find();
        const matchedJobs = getMatchedJobs(userProfile, allJobs);
        res.status(200).json({ success: true, matchedJobs });
    } catch (error) {
        console.error("Oops! Something went wrong during matching:", error);
        res.status(500).json({ success: false, message: "Error processing your match request." });
    }
});
app.listen(PORT, () => {
    console.log(`\n Server is up and running!`);
    console.log(` Open your browser and visit: http://localhost:${PORT}`);
});
