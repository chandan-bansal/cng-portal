import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddEntry = () => {
    const navigate = useNavigate();

    // Initial state with local storage fallback
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('addEntryForm');
        return savedData ? JSON.parse(savedData) : {
            date: new Date().toISOString().split('T')[0],
            customerName: '',
            mobileNumber: '',
            vehicleNumber: '',
            vehicleType: 'Car',
            cylinderQuantity: 1,
            amount: '',
            mode: 'Cash',
            reference: '',
            inTime: '',
            outTime: '',
            googleReview: false,
            autoPosterFixed: false,
            cngMiniPoster: false,
            remarks: ''
        };
    });

    // Save to local storage whenever formData changes
    useEffect(() => {
        localStorage.setItem('addEntryForm', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tests', formData);
            toast.success('Entry added successfully!');
            // Clear storage on success
            localStorage.removeItem('addEntryForm');
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error('Failed to add entry');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Entry</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Basic Info - Removed srNo */}
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" required />
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                    <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" />
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700">
                        <option>Car</option>
                        <option>Auto</option>
                        <option>Taxi Car</option>
                        <option>Bus</option>
                        <option>Truck</option>
                    </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Cylinder Qty</label>
                    <input type="number" name="cylinderQuantity" value={formData.cylinderQuantity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" />
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Mode</label>
                    <select name="mode" value={formData.mode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700">
                        <option>Cash</option>
                        <option>Online</option>
                        <option>Cheque</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Reference</label>
                    <input type="text" name="reference" value={formData.reference} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" placeholder="e.g. Pamphlet, Old Customer" />
                </div>

                {/* Timing */}
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">In Time</label>
                    <input type="time" name="inTime" value={formData.inTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Out Time</label>
                    <input type="time" name="outTime" value={formData.outTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" />
                </div>

                {/* Checkboxes */}
                <div className="col-span-2 flex flex-wrap gap-6">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="googleReview" checked={formData.googleReview} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-700">Google Review</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="autoPosterFixed" checked={formData.autoPosterFixed} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-700">Auto Poster Fixed</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="cngMiniPoster" checked={formData.cngMiniPoster} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-700">CNG Mini Poster</span>
                    </label>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Remarks</label>
                    <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-slate-700" rows="3"></textarea>
                </div>

                <div className="col-span-2">
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Add Entry
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEntry;
