import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMail, FiPhone, FiBriefcase, FiMapPin, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { clientsAPI } from '../utils/api';
import { formatCurrency, getStatusColor } from '../utils/helpers';

const ClientModal = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    notes: '',
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {client ? 'Edit Client' : 'Add New Client'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="label">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="input"
                  placeholder="ABC Corp"
                />
              </div>

              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                  placeholder="+1 234 567 8900"
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
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Street Address</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, street: e.target.value } 
                  })}
                  className="input"
                  placeholder="123 Main St"
                />
              </div>

              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, city: e.target.value } 
                  })}
                  className="input"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="label">State</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, state: e.target.value } 
                  })}
                  className="input"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="label">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, country: e.target.value } 
                  })}
                  className="input"
                  placeholder="USA"
                />
              </div>

              <div>
                <label className="label">Zip Code</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, zipCode: e.target.value } 
                  })}
                  className="input"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows="3"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn btn-primary">
              {client ? 'Update' : 'Create'} Client
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

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchClients();
  }, [searchTerm, statusFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getAll({ search: searchTerm, status: statusFilter });
      setClients(response.data.clients);
    } catch (error) {
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedClient) {
        await clientsAPI.update(selectedClient._id, formData);
        toast.success('Client updated successfully');
      } else {
        await clientsAPI.create(formData);
        toast.success('Client created successfully');
      }
      setModalOpen(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      toast.error('Failed to save client');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsAPI.delete(id);
        toast.success('Client deleted successfully');
        fetchClients();
      } catch (error) {
        toast.error('Failed to delete client');
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage your client relationships</p>
        </div>
        <button
          onClick={() => {
            setSelectedClient(null);
            setModalOpen(true);
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Client</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-blue-100 mb-2">Total Clients</h3>
          <p className="text-4xl font-bold">{clients.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-green-100 mb-2">Active Clients</h3>
          <p className="text-4xl font-bold">{clients.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-purple-100 mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold">
            {formatCurrency(clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0))}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input md:w-48"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client._id} className="card hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{client.name}</h3>
                  {client.company && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiBriefcase className="mr-1" size={12} />
                      {client.company}
                    </p>
                  )}
                </div>
              </div>
              <span className={`badge badge-${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <FiMail className="mr-2" />
                <span className="truncate">{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <FiPhone className="mr-2" />
                  <span>{client.phone}</span>
                </div>
              )}
              {(client.address?.city || client.address?.country) && (
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>
                    {[client.address?.city, client.address?.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-bold text-gray-900">{formatCurrency(client.totalRevenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projects</span>
                <span className="font-bold text-gray-900">{client.projectCount || 0}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => {
                  setSelectedClient(client);
                  setModalOpen(true);
                }}
                className="flex-1 btn btn-primary text-sm py-2"
              >
                <FiEdit2 className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(client._id)}
                className="btn btn-danger text-sm py-2"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No clients found. Click "Add Client" to create one.</p>
        </div>
      )}

      <ClientModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onSave={handleSave}
      />
    </div>
  );
};

export default Clients;

