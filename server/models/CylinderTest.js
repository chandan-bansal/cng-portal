const mongoose = require('mongoose');

const CylinderTestSchema = new mongoose.Schema({
    srNo: { type: String }, // Serial Number from sheet
    date: { type: Date, default: Date.now },
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    vehicleNumber: { type: String },
    vehicleType: { type: String }, // Auto, Car, Taxi Car
    cylinderQuantity: { type: Number, default: 1 },
    amount: { type: Number },
    mode: { type: String, default: 'Cash' }, // Payment Mode
    reference: { type: String }, // Pamphlet, Old Customer, etc.
    inTime: { type: String }, // e.g. "10:00AM"
    outTime: { type: String }, // e.g. "11:50AM"
    googleReview: { type: Boolean, default: false },
    autoPosterFixed: { type: Boolean, default: false },
    cngMiniPoster: { type: Boolean, default: false },
    remarks: { type: String },
    nextTestDate: { type: Date } // Calculated as date + 3 years
}, { timestamps: true });

// Pre-save hook to calculate next test date
// Pre-save hook to calculate next test date
CylinderTestSchema.pre('save', function () {
    if (this.date && !this.nextTestDate) {
        const testDate = new Date(this.date);
        testDate.setFullYear(testDate.getFullYear() + 3);
        this.nextTestDate = testDate;
    }
});

module.exports = mongoose.model('CylinderTest', CylinderTestSchema);
