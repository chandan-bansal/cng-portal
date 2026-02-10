import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

const History = () => {
    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTests();
        }, 500); // Debounce
        return () => clearTimeout(timer);
    }, [search, startDate, endDate]);

    const fetchTests = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/tests?${params.toString()}`);
            setTests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const startEdit = (test) => {
        setEditingId(test._id);
        setEditForm({ ...test });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const saveEdit = async () => {
        try {
            const { _id, __v, createdAt, updatedAt, ...payload } = editForm;
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.put(`${apiUrl}/api/tests/${editingId}`, payload);
            toast.success('Entry updated');
            setEditingId(null);
            fetchTests();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update entry');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">History</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Date Filters */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex flex-col w-full">
                            <label className="text-xs text-slate-500">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 text-slate-500 w-full"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-xs text-slate-500">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 text-slate-500 w-full"
                            />
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search vehicle, name..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 w-full md:w-64 text-sm text-slate-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Time</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tests.map((test) => (
                                <tr key={test._id}>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{test.srNo}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{test.customerName}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{test.vehicleNumber}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {editingId === test._id ? (
                                            <input
                                                type="time"
                                                name="outTime"
                                                value={editForm.outTime || ''}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-32"
                                            />
                                        ) : (
                                            test.outTime || '-'
                                        )}
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                                        {editingId === test._id ? (
                                            <div className="flex items-center gap-2">
                                                <button onClick={saveEdit} className="text-green-600 hover:text-green-900"><Save size={18} /></button>
                                                <button onClick={cancelEdit} className="text-red-600 hover:text-red-900"><X size={18} /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => startEdit(test)} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden grid grid-cols-1 divide-y divide-gray-200">
                    {tests.map((test) => (
                        <div key={test._id} className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-mono text-gray-400 block mb-1">#{test.srNo}</span>
                                    <h3 className="text-sm font-bold text-gray-800">{test.customerName}</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">{test.vehicleNumber}</p>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {new Date(test.date).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm mt-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Out Time:</span>
                                    {editingId === test._id ? (
                                        <input
                                            type="time"
                                            name="outTime"
                                            value={editForm.outTime || ''}
                                            onChange={handleEditChange}
                                            className="border rounded px-2 py-1 w-24 text-sm"
                                        />
                                    ) : (
                                        <span className="font-medium text-gray-700">{test.outTime || '-'}</span>
                                    )}
                                </div>

                                {editingId === test._id ? (
                                    <div className="flex items-center gap-3">
                                        <button onClick={saveEdit} className="p-1 text-green-600 bg-green-50 rounded"><Save size={18} /></button>
                                        <button onClick={cancelEdit} className="p-1 text-red-600 bg-red-50 rounded"><X size={18} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => startEdit(test)} className="p-1 text-blue-600 bg-blue-50 rounded"><Edit size={18} /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default History;
