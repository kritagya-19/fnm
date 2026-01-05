const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const { status, client, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (client) query.client = client;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('client', 'name company')
      .populate('teamMembers', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client')
      .populate('teamMembers', 'name email avatar role')
      .populate('tasks.assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.userId
    });
    await project.save();
    await project.populate('client teamMembers createdBy');

    res.status(201).json({ 
      message: 'Project created successfully',
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client teamMembers createdBy');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ 
      message: 'Project updated successfully',
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task operations
router.post('/:id/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.tasks.push(req.body);
    await project.save();
    await project.populate('tasks.assignedTo', 'name email avatar');

    res.status(201).json({ 
      message: 'Task added successfully',
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = project.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    Object.assign(task, req.body);
    await project.save();
    await project.populate('tasks.assignedTo', 'name email avatar');

    res.json({ 
      message: 'Task updated successfully',
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.tasks.pull(req.params.taskId);
    await project.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

