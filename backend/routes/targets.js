const express = require('express');
const router = express.Router();
const Target = require('../models/Target');
const { auth } = require('../middleware/auth');

// Get all targets
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, period } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (period) query.period = period;

    const targets = await Target.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ targets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get target by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const target = await Target.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');
    
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    res.json({ target });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create target
router.post('/', auth, async (req, res) => {
  try {
    const target = new Target({
      ...req.body,
      createdBy: req.userId
    });
    await target.save();
    await target.populate('assignedTo createdBy');

    res.status(201).json({ 
      message: 'Target created successfully',
      target 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update target
router.put('/:id', auth, async (req, res) => {
  try {
    const target = await Target.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo createdBy');

    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    res.json({ 
      message: 'Target updated successfully',
      target 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete target
router.delete('/:id', auth, async (req, res) => {
  try {
    const target = await Target.findByIdAndDelete(req.params.id);
    
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    res.json({ message: 'Target deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

