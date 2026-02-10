import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Clock, Calendar, Truck, User, Phone, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

const Dashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({ weeklyStats: [], totalTests: 0 });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [alertSearch, setAlertSearch] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const [alertsRes, statsRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/tests/alerts?search=${alertSearch}`),
                    axios.get(`${apiUrl}/api/tests/stats?month=${selectedDate.split('-')[1]}&year=${selectedDate.split('-')[0]}`)
                ]);

                setAlerts(alertsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        // Debounce search could be added, but for now simple effect dependency
        const timer = setTimeout(() => {
            fetchDashboardData();
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedDate, alertSearch]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Overview of your CNG testing facility</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full md:w-auto">
                    <input
                        type="month"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors w-full sm:w-auto"
                        style={{ colorScheme: 'dark' }}
                    />
                    <div className="px-4 py-2 rounded-full glass flex items-center justify-center gap-2 text-sm text-primary-200 w-full sm:w-auto whitespace-nowrap">
                        <Activity size={16} className="text-primary-400" />
                        <span>System Operational</span>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Card */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary-400" />
                            Monthly Performance
                        </h3>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.weeklyStats}>
                                <defs>
                                    <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Area type="monotone" dataKey="tests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTests)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Total Tests Card */}
                <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/5 relative flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-white w-full text-left mb-6">Total Tests</h3>
                    <div className="relative flex flex-col items-center justify-center h-full">
                        <span className="text-6xl font-bold text-white tracking-widest">{stats.totalTests}</span>
                        <span className="text-slate-400 mt-2">Tests conducted in {new Date(selectedDate).toLocaleString('default', { month: 'long' })}</span>
                    </div>
                </motion.div>
            </div>

            {/* Alerts Section */}
            <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="px-6 py-5 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400 ring-1 ring-red-500/30">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Critical Alerts</h2>
                            <p className="text-xs text-slate-400">Vehicles overdue for testing</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            value={alertSearch}
                            onChange={(e) => setAlertSearch(e.target.value)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500 transition-colors w-full md:w-48"
                        />
                        <button className="text-xs font-medium text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors whitespace-nowrap">
                            View All
                        </button>
                    </div>
                </div>

                <div className="p-0">
                    {alerts.length === 0 ? (
                        <div className="p-12 text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500/20 mb-4" />
                            <p className="text-gray-400 text-lg">All good! System is healthy.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">Customer</th>
                                            <th className="px-6 py-4 font-semibold">Vehicle</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Last Action</th>
                                            <th className="px-6 py-4 font-semibold text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {alerts.map((alert) => (
                                            <tr key={alert._id} className="group hover:bg-white/5 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-1 ring-white/10">
                                                            {alert.customerName?.[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors">{alert.customerName}</p>
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                                                <Phone size={11} />
                                                                {alert.mobileNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-white font-mono">{alert.vehicleNumber}</span>
                                                        <span className="text-xs text-slate-500">Chassis No: ...{alert.chassisNumber?.slice(-4) || 'XXXX'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20 flex items-center gap-1.5">
                                                            <Clock size={12} />
                                                            Overdue
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-600" />
                                                        {new Date(alert.testDate || alert.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                                        <Truck size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden grid grid-cols-1 divide-y divide-white/5">
                                {alerts.map((alert) => (
                                    <div key={alert._id} className="p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-1 ring-white/10">
                                                    {alert.customerName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{alert.customerName}</p>
                                                    <p className="text-xs text-slate-400 font-mono">{alert.vehicleNumber}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-semibold border border-red-500/20 uppercase tracking-wide">
                                                Overdue
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-400 pl-[52px]">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Phone size={12} />
                                                    {alert.mobileNumber}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    {new Date(alert.testDate || alert.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <button className="p-1.5 bg-white/5 rounded-lg text-slate-300">
                                                <Truck size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
