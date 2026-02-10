const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createUser = async () => {
    try {
        const username = process.argv[2];
        const password = process.argv[3];

        if (!username || !password) {
            console.log('Usage: node create_user.js <username> <password>');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        let user = await User.findOne({ username });
        if (user) {
            console.log('User already exists');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            password: hashedPassword,
            role: 'owner' // Default to owner/admin
        });

        await user.save();
        console.log(`User '${username}' created successfully!`);
        process.exit();

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

createUser();
