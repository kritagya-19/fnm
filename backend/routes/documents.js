const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { auth } = require('../middleware/auth');

// Get all documents
router.get('/', auth, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get document by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create document (in real app, this would handle file upload)
router.post('/', auth, async (req, res) => {
  try {
    const document = new Document({
      ...req.body,
      uploadedBy: req.userId
    });
    await document.save();
    await document.populate('uploadedBy', 'name email');

    res.status(201).json({ 
      message: 'Document uploaded successfully',
      document 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update document
router.put('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ 
      message: 'Document updated successfully',
      document 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

