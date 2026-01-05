import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiUsers, FiCheckCircle, FiDollarSign, FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { projectsAPI, clientsAPI } from '../utils/api';
import { formatCurrency, formatDate, getStatusColor, getPriorityColor } from '../utils/helpers';

const ProjectModal = ({ isOpen, onClose, project, onSave, clients }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: '',
    status: 'planning',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        client: project.client?._id || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows="3"
                placeholder="Project description..."
              />
            </div>

            <div>
              <label className="label">Client *</label>
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="input"
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="label">Budget</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="input"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="label">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn btn-primary">
              {project ? 'Update' : 'Create'} Project
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const progressPercentage = project.progress || 0;
  
  return (
    <div className="card hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.client?.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`badge badge-${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          <span className={`badge badge-${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <FiClock className="mr-2" />
            <span>{formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Ongoing'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <FiDollarSign className="mr-2" />
            <span>Budget: {formatCurrency(project.budget || 0)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiUsers className="mr-2" />
            <span>{project.teamMembers?.length || 0} members</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2 border-t border-gray-200 pt-4">
        <button
          onClick={() => onEdit(project)}
          className="flex-1 btn btn-primary text-sm py-2"
        >
          <FiEdit2 className="mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="btn btn-danger text-sm py-2"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, clientsRes] = await Promise.all([
        projectsAPI.getAll({ status: statusFilter }),
        clientsAPI.getAll(),
      ]);
      setProjects(projectsRes.data.projects);
      setClients(clientsRes.data.clients);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedProject) {
        await projectsAPI.update(selectedProject._id, formData);
        toast.success('Project updated successfully');
      } else {
        await projectsAPI.create(formData);
        toast.success('Project created successfully');
      }
      setModalOpen(false);
      setSelectedProject(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        toast.success('Project deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects & Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
        </div>
        <button
          onClick={() => {
            setSelectedProject(null);
            setModalOpen(true);
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Project</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-blue-100 mb-2">Total Projects</h3>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-green-100 mb-2">Active</h3>
          <p className="text-4xl font-bold">{stats.active}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-purple-100 mb-2">Completed</h3>
          <p className="text-4xl font-bold">{stats.completed}</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <h3 className="text-orange-100 mb-2">Total Budget</h3>
          <p className="text-3xl font-bold">{formatCurrency(stats.totalBudget)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={(project) => {
              setSelectedProject(project);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="card text-center py-12">
          <FiFolder className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-gray-500">No projects found. Click "Add Project" to create one.</p>
        </div>
      )}

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSave={handleSave}
        clients={clients}
      />
    </div>
  );
};

export default Projects;

