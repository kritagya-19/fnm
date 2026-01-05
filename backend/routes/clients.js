const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { auth } = require('../middleware/auth');

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get client by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create client
router.post('/', auth, async (req, res) => {
  try {
    const client = new Client({
      ...req.body,
      createdBy: req.userId
    });
    await client.save();

    res.status(201).json({ 
      message: 'Client created successfully',
      client 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update client
router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ 
      message: 'Client updated successfully',
      client 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

