const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const { type, startDate, endDate, client, project } = req.query;
    let query = {};

    if (type) query.type = type;
    if (client) query.client = client;
    if (project) query.project = project;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('client', 'name company')
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('client')
      .populate('project')
      .populate('createdBy', 'name email');
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      createdBy: req.userId
    };
    
    // Remove empty client/project fields to avoid validation errors
    if (!transactionData.client || transactionData.client === '') {
      delete transactionData.client;
    }
    if (!transactionData.project || transactionData.project === '') {
      delete transactionData.project;
    }
    
    const transaction = new Transaction(transactionData);
    await transaction.save();
    await transaction.populate('client project createdBy');

    res.status(201).json({ 
      message: 'Transaction created successfully',
      transaction 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Remove empty client/project fields to avoid validation errors
    if (!updateData.client || updateData.client === '') {
      delete updateData.client;
    }
    if (!updateData.project || updateData.project === '') {
      delete updateData.project;
    }
    
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client project createdBy');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ 
      message: 'Transaction updated successfully',
      transaction 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get financial summary
router.get('/summary/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateQuery = {};
    
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    const income = await Transaction.aggregate([
      { $match: { type: 'income', status: 'completed', ...dateQuery } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expense = await Transaction.aggregate([
      { $match: { type: 'expense', status: 'completed', ...dateQuery } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;
    const netProfit = totalIncome - totalExpense;

    // Category-wise breakdown
    const incomeByCategory = await Transaction.aggregate([
      { $match: { type: 'income', status: 'completed', ...dateQuery } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    const expenseByCategory = await Transaction.aggregate([
      { $match: { type: 'expense', status: 'completed', ...dateQuery } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        netProfit,
        profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0
      },
      incomeByCategory,
      expenseByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

