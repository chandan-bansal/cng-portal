const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CylinderTest = require('./models/CylinderTest');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const generateRandomData = async () => {
    await connectDB();

    const vehicleTypes = ['Car', 'Auto', 'Taxi Car', 'Bus', 'Truck'];
    const modes = ['Cash', 'Online', 'Cheque'];
    const firstNames = ['Rahul', 'Amit', 'Priya', 'Suresh', 'Deepak', 'Anita', 'Ravi', 'Sunita', 'Vikram', 'Pooja', 'Arun', 'Sneha'];
    const lastNames = ['Sharma', 'Verma', 'Singh', 'Patel', 'Gupta', 'Kumar', 'Yadav', 'Das', 'Chopra', 'Mehta', 'Joshi', 'Reddy'];

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const tests = [];
    const today = new Date();

    // Generate for current month + last 3 months (4 months total)
    for (let i = 0; i < 4; i++) {
        const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Generate 15-40 records per month
        const numRecords = getRandomNumber(15, 40);
        console.log(`Generating ${numRecords} records for month: ${month + 1}/${year}`);

        for (let j = 0; j < numRecords; j++) {
            const day = getRandomNumber(1, daysInMonth);
            // Avoid future dates for current month
            if (i === 0 && day > today.getDate()) continue;

            const testDate = new Date(year, month, day);

            // Calculate next test date (3 years later)
            const nextTestDate = new Date(testDate);
            nextTestDate.setFullYear(testDate.getFullYear() + 3);

            const vehicleNum = `MH-${getRandomNumber(1, 50)}-${String.fromCharCode(65 + getRandomNumber(0, 25))}${String.fromCharCode(65 + getRandomNumber(0, 25))}-${getRandomNumber(1000, 9999)}`;

            tests.push({
                srNo: `${year}${month + 1}${getRandomNumber(1000, 9999)}`,
                date: testDate,
                customerName: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
                mobileNumber: `9${getRandomNumber(100000000, 999999999)}`,
                vehicleNumber: vehicleNum,
                vehicleType: getRandomElement(vehicleTypes),
                cylinderQuantity: getRandomNumber(1, 4),
                amount: getRandomNumber(1500, 5000),
                mode: getRandomElement(modes),
                reference: Math.random() > 0.7 ? 'Pamphlet' : 'Old Customer',
                inTime: `${getRandomNumber(9, 12)}:${getRandomNumber(10, 59)} AM`,
                outTime: `${getRandomNumber(1, 6)}:${getRandomNumber(10, 59)} PM`,
                googleReview: Math.random() > 0.5,
                autoPosterFixed: Math.random() > 0.5,
                cngMiniPoster: Math.random() > 0.5,
                remarks: Math.random() > 0.8 ? 'Good condition' : '',
                nextTestDate: nextTestDate
            });
        }
    }

    try {
        // Optional: Clear existing data? 
        // await CylinderTest.deleteMany({}); 
        // console.log('Cleared existing data...');
        // User asked to "Add data", not replace. So I will just insert.

        await CylinderTest.insertMany(tests);
        console.log(`Successfully added ${tests.length} records!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

generateRandomData();
