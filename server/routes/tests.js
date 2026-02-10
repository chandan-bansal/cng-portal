const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CylinderTest = require('../models/CylinderTest');

// @route   GET api/tests/stats
// @desc    Get weekly stats for a specific month
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ msg: 'Please provide month and year' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const tests = await CylinderTest.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Initialize weekly counts (assuming 5 weeks max to cover partial weeks)
        const weeklyStats = [
            { name: 'Week 1', tests: 0 },
            { name: 'Week 2', tests: 0 },
            { name: 'Week 3', tests: 0 },
            { name: 'Week 4', tests: 0 },
            { name: 'Week 5', tests: 0 }
        ];

        tests.forEach(test => {
            const date = new Date(test.date);
            const day = date.getDate();
            const weekIndex = Math.floor((day - 1) / 7);
            if (weeklyStats[weekIndex]) {
                weeklyStats[weekIndex].tests++;
            }
        });

        // Filter out Week 5 if empty and it's a short month/alignment? 
        // Actually, keep it consistent for UI or trim trailing 0s? 
        // Let's keep 5 weeks to be safe.

        res.json({
            weeklyStats,
            totalTests: tests.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in GET Stats route');
    }
});

// @route   GET api/tests
// @desc    Get all tests / Search / Date Filter
// @access  Private (Owner only)
router.get('/', auth, async (req, res) => {
    try {
        // Simple search functionality
        const { search, startDate, endDate } = req.query;
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { customerName: regex },
                { vehicleNumber: regex },
                { mobileNumber: regex },
                { srNo: regex }
            ];
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            };
        }

        const tests = await CylinderTest.find(query).sort({ date: -1 });
        res.json(tests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in GET Test route');
    }
});

// @route   GET api/tests/alerts
// @desc    Get tests due for re-test (3 years passed) - SMART START (Latest Test Only)
// @access  Private
router.get('/alerts', auth, async (req, res) => {
    try {
        const today = new Date();
        const { search } = req.query;

        const pipeline = [
            // 1. Sort by date descending (latest first)
            { $sort: { date: -1 } },
            // 2. Group by vehicleNumber to get the latest test doc
            {
                $group: {
                    _id: "$vehicleNumber",
                    latestTest: { $first: "$$ROOT" }
                }
            },
            // 3. Replace root with the latest test document
            { $replaceRoot: { newRoot: "$latestTest" } },
            // 4. Match only if nextTestDate is overdue (<= today)
            {
                $match: {
                    nextTestDate: { $lte: today }
                }
            }
        ];

        // 5. Add Search Filter if provided
        if (search) {
            const regex = new RegExp(search, 'i');
            pipeline.push({
                $match: {
                    $or: [
                        { customerName: regex },
                        { vehicleNumber: regex },
                        { mobileNumber: regex }
                    ]
                }
            });
        }

        // 6. Final Sort for UI (e.g., most overdue first)
        pipeline.push({ $sort: { nextTestDate: 1 } });

        const alerts = await CylinderTest.aggregate(pipeline);
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in GET Test Alerts route');
    }
});

// @route   POST api/tests
// @desc    Add new test record
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        let { srNo, ...rest } = req.body;

        // Auto-generate srNo if not provided
        if (!srNo) {
            const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
            const year = new Date().getFullYear().toString().substr(-2);
            srNo = `CNG${year}-${randomStr}`;
        }

        const newTest = new CylinderTest({ srNo, ...rest });
        const test = await newTest.save();
        res.json(test);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in POST Test route');
    }
});

// @route   PUT api/tests/:id
// @desc    Update test record (e.g. exit time)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let test = await CylinderTest.findById(req.params.id);
        if (!test) return res.status(404).json({ msg: 'Test not found' });

        test = await CylinderTest.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(test);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in PUT Test route');
    }
});

module.exports = router;
