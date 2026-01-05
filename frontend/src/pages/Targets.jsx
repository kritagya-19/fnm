import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTarget, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { targetsAPI } from '../utils/api';
import { formatDate, getStatusColor } from '../utils/helpers';

const TargetModal = ({ isOpen, onClose, target, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'revenue',
    targetValue: '',
    currentValue: '',
    unit: 'USD',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
  });

  useEffect(() => {
    if (target) {
      setFormData({
        ...target,
        startDate: target.startDate ? new Date(target.startDate).toISOString().split('T')[0] : '',
        endDate: target.endDate ? new Date(target.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [target]);

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
            {target ? 'Edit Target' : 'Add New Target'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Target Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="e.g., Q1 Revenue Target"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows="2"
                placeholder="Target description..."
              />
            </div>

            <div>
              <label className="label">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
                required
              >
                <option value="revenue">Revenue</option>
                <option value="projects">Projects</option>
                <option value="clients">Clients</option>
                <option value="tasks">Tasks</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="label">Period *</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="input"
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="label">Target Value *</label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                className="input"
                placeholder="100000"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="label">Current Value</label>
              <input
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="input"
                placeholder="50000"
                step="0.01"
              />
            </div>

            <div>
              <label className="label">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="input"
                placeholder="USD, units, etc."
              />
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
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
              <label className="label">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn btn-primary">
              {target ? 'Update' : 'Create'} Target
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

const Targets = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [filter, setFilter] = useState({ status: '', type: '' });

  useEffect(() => {
    fetchTargets();
  }, [filter]);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const response = await targetsAPI.getAll(filter);
      setTargets(response.data.targets);
    } catch (error) {
      toast.error('Failed to fetch targets');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedTarget) {
        await targetsAPI.update(selectedTarget._id, formData);
        toast.success('Target updated successfully');
      } else {
        await targetsAPI.create(formData);
        toast.success('Target created successfully');
      }
      setModalOpen(false);
      setSelectedTarget(null);
      fetchTargets();
    } catch (error) {
      toast.error('Failed to save target');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this target?')) {
      try {
        await targetsAPI.delete(id);
        toast.success('Target deleted successfully');
        fetchTargets();
      } catch (error) {
        toast.error('Failed to delete target');
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
    total: targets.length,
    active: targets.filter(t => t.status === 'active').length,
    completed: targets.filter(t => t.status === 'completed').length,
    avgProgress: targets.length > 0 
      ? (targets.reduce((sum, t) => sum + (t.progress || 0), 0) / targets.length).toFixed(1)
      : 0,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Targets & Performance</h1>
          <p className="text-gray-600 mt-1">Track your goals and measure progress</p>
        </div>
        <button
          onClick={() => {
            setSelectedTarget(null);
            setModalOpen(true);
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Target</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-blue-100 mb-2">Total Targets</h3>
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
          <h3 className="text-orange-100 mb-2">Avg Progress</h3>
          <p className="text-4xl font-bold">{stats.avgProgress}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="input md:w-48"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="input md:w-48"
          >
            <option value="">All Types</option>
            <option value="revenue">Revenue</option>
            <option value="projects">Projects</option>
            <option value="clients">Clients</option>
            <option value="tasks">Tasks</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {targets.map((target) => {
          const progress = target.progress || 0;
          const progressColor = progress >= 100 ? 'bg-green-600' : progress >= 75 ? 'bg-blue-600' : progress >= 50 ? 'bg-yellow-600' : 'bg-red-600';

          return (
            <div key={target._id} className="card hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <FiTarget className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{target.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{target.type} • {target.period}</p>
                  </div>
                </div>
                <span className={`badge badge-${getStatusColor(target.status)}`}>
                  {target.status}
                </span>
              </div>

              {target.description && (
                <p className="text-sm text-gray-600 mb-4">{target.description}</p>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current / Target</span>
                  <span className="font-bold text-gray-900">
                    {target.currentValue} / {target.targetValue} {target.unit}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${progressColor} h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-1`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                      {progress >= 10 && (
                        <FiTrendingUp className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <span>{formatDate(target.startDate)}</span>
                  <span>→</span>
                  <span>{formatDate(target.endDate)}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedTarget(target);
                    setModalOpen(true);
                  }}
                  className="flex-1 btn btn-primary text-sm py-2"
                >
                  <FiEdit2 className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(target._id)}
                  className="btn btn-danger text-sm py-2"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {targets.length === 0 && (
        <div className="card text-center py-12">
          <FiTarget className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-gray-500">No targets found. Click "Add Target" to create one.</p>
        </div>
      )}

      <TargetModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTarget(null);
        }}
        target={selectedTarget}
        onSave={handleSave}
      />
    </div>
  );
};

export default Targets;

