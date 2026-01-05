const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Target = require('../models/Target');
const { auth } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Financial stats
    const monthlyIncome = await Transaction.aggregate([
      { $match: { type: 'income', status: 'completed', date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyExpense = await Transaction.aggregate([
      { $match: { type: 'expense', status: 'completed', date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const yearlyIncome = await Transaction.aggregate([
      { $match: { type: 'income', status: 'completed', date: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Client stats
    const totalClients = await Client.countDocuments();
    const activeClients = await Client.countDocuments({ status: 'active' });

    // Project stats
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    // Target stats
    const activeTargets = await Target.find({ status: 'active' })
      .populate('assignedTo', 'name')
      .limit(5);

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .populate('client', 'name')
      .populate('project', 'name')
      .sort({ date: -1 })
      .limit(10);

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const monthlyTrend = await Transaction.aggregate([
      { 
        $match: { 
          type: 'income', 
          status: 'completed', 
          date: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      financial: {
        monthlyIncome: monthlyIncome[0]?.total || 0,
        monthlyExpense: monthlyExpense[0]?.total || 0,
        yearlyIncome: yearlyIncome[0]?.total || 0,
        monthlyProfit: (monthlyIncome[0]?.total || 0) - (monthlyExpense[0]?.total || 0)
      },
      clients: {
        total: totalClients,
        active: activeClients
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects
      },
      activeTargets,
      recentTransactions,
      monthlyTrend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

