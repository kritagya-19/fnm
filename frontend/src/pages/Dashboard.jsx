import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, FiUsers, FiFolder, FiTrendingUp, 
  FiArrowUp, FiArrowDown, FiTarget, FiActivity
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../utils/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card group relative overflow-hidden"
  >
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        {trend && (
          <div className={`flex items-center mt-2 px-2 py-0.5 rounded-lg w-fit text-xs font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend === 'up' ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-2xl text-white" />
      </div>
    </div>
    {/* Decorative background shape */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.2em]">Live Analytics</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial <span className="text-slate-400">Hub</span></h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-3"
        >
          <button className="btn btn-secondary flex items-center space-x-2">
            <FiActivity />
            <span>Generate Report</span>
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.financial?.monthlyIncome || 0)}
          icon={FiDollarSign}
          trend="up"
          trendValue="12.5%"
          color="bg-primary-600"
          delay={0.1}
        />
        <StatCard
          title="Total Clients"
          value={stats?.clients?.total || 0}
          icon={FiUsers}
          trend="up"
          trendValue={`${stats?.clients?.active || 0} active`}
          color="bg-indigo-600"
          delay={0.2}
        />
        <StatCard
          title="Active Projects"
          value={stats?.projects?.active || 0}
          icon={FiFolder}
          trend="up"
          trendValue={`${stats?.projects?.total || 0} total`}
          color="bg-violet-600"
          delay={0.3}
        />
        <StatCard
          title="Monthly Profit"
          value={formatCurrency(stats?.financial?.monthlyProfit || 0)}
          icon={FiTrendingUp}
          trend="up"
          trendValue="8.2%"
          color="bg-emerald-600"
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="card h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Revenue Over Time</h3>
              <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlyTrend?.map(item => ({ name: item._id ? `${item._id.month}/${item._id.year}` : 'N/A', revenue: item.total })) || []}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b67f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b67f5" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Side Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          {/* Recent Activity Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">Recent Activity</h3>
              <FiActivity className="text-primary-600" />
            </div>
            <div className="space-y-5">
              {stats?.recentTransactions?.slice(0, 5)?.map((transaction, idx) => (
                <div key={transaction._id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      transaction.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {transaction.type === 'income' ? <FiArrowUp /> : <FiArrowDown />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{transaction.category}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-xs font-bold text-slate-400 hover:text-primary-600 uppercase tracking-[0.2em] border-t border-slate-50 transition-colors">
              View All Transactions
            </button>
          </div>

          {/* Active Targets */}
          <div className="card bg-slate-900 text-white border-none shadow-2xl shadow-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white tracking-tight uppercase">Current Targets</h3>
              <FiTarget className="text-primary-400" />
            </div>
            <div className="space-y-6">
              {stats?.activeTargets?.slice(0, 3)?.map((target) => (
                <div key={target._id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">{target.name}</span>
                    <span className="text-xs font-black text-primary-400">{target.progress?.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${target.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="bg-primary-500 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              )) || <p className="text-slate-500 text-xs text-center py-4 italic">No targets active</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;