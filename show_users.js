import mongoose from 'mongoose';
import User from './models/User.js';

async function showUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/jobPortal');
        console.log('--- Connected to jobPortal Database ---');
        const users = await User.find({}, '-__v').lean();
        console.log(`\nFound ${users.length} registered users in the database:\n`);
        users.forEach((user, index) => {
            console.log(`User #${index + 1}`);
            console.log(`  ID: ${user._id}`);
            console.log(`  Username: ${user.username}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Password Hash: ${user.password.substring(0, 20)}... (Encrypted by Bcrypt)`);
            console.log(`  Registered At: ${user.createdAt}`);
            console.log('-----------------------------------');
        });
        process.exit(0);
    } catch (error) {
        console.error("Error connecting or fetching users:", error);
        process.exit(1);
    }
}
showUsers();
