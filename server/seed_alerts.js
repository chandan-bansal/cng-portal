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

const seedAlerts = async () => {
    await connectDB();

    const oldRecords = [
        { name: 'Sohan Lal', vehicle: 'MH-04-AB-1234', date: '2023-01-15' },
        { name: 'Vikas Dubey', vehicle: 'MH-02-XY-9876', date: '2023-02-01' },
        { name: 'Pooja Singh', vehicle: 'MH-43-ZZ-5555', date: '2022-12-20' },
        { name: 'Amitabh Bachchan', vehicle: 'MH-01-Big-B', date: '2023-01-05' },
        { name: 'Rekha Ji', vehicle: 'MH-01-EQ-1111', date: '2022-11-30' }
    ];

    const tests = [];

    for (const record of oldRecords) {
        const testDate = new Date(record.date);
        // nextTestDate will be calculated by pre-save hook, 
        // OR we can explicitly set it here to be sure, although hook is better.
        // Let's rely on the hook, but we must use .save() or create() for hooks to fire.
        // insertMany() triggers hooks if validation is not skipped? 
        // Actually, Mongoose insertMany might NOT trigger pre('save') middleware depending on options.
        // To be safe and simple, let's just construct the object fully here or loop save.

        // Let's explicitly calculate nextTestDate here to match the hook logic 
        // just in case we use insertMany which is faster.
        const nextTestDate = new Date(testDate);
        nextTestDate.setFullYear(testDate.getFullYear() + 3);

        tests.push({
            srNo: `OLD-${Math.floor(Math.random() * 1000)}`,
            date: testDate,
            customerName: record.name,
            mobileNumber: `9${Math.floor(Math.random() * 1000000000)}`,
            vehicleNumber: record.vehicle,
            vehicleType: 'Car',
            cylinderQuantity: 1,
            amount: 2500,
            mode: 'Cash',
            reference: 'Old Data',
            inTime: '10:00 AM',
            outTime: '02:00 PM',
            nextTestDate: nextTestDate // Explicitly setting it to ensure it's there
        });
    }

    try {
        await CylinderTest.insertMany(tests);
        console.log(`Successfully added ${tests.length} overdue records!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAlerts();
