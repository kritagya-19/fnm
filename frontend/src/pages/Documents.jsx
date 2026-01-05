import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFile, FiDownload, FiSearch, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { documentsAPI } from '../utils/api';
import { formatDate } from '../utils/helpers';

const DocumentModal = ({ isOpen, onClose, document, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fileUrl: '',
    fileType: 'pdf',
    fileSize: 0,
    category: 'other',
    tags: '',
  });

  useEffect(() => {
    if (document) {
      setFormData({
        ...document,
        tags: document.tags?.join(', ') || '',
      });
    }
  }, [document]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {document ? 'Edit Document' : 'Add New Document'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Document Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="e.g., Project Contract 2024"
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
                placeholder="Document description..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">File URL *</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="input"
                placeholder="https://example.com/document.pdf"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter the URL or upload location of your document</p>
            </div>

            <div>
              <label className="label">File Type *</label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                className="input"
                required
              >
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
                <option value="ppt">PPT</option>
                <option value="pptx">PPTX</option>
                <option value="txt">TXT</option>
                <option value="image">Image</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">File Size (KB) *</label>
              <input
                type="number"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                className="input"
                placeholder="1024"
                required
              />
            </div>

            <div>
              <label className="label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
              >
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="receipt">Receipt</option>
                <option value="report">Report</option>
                <option value="presentation">Presentation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="input"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn btn-primary">
              {document ? 'Update' : 'Add'} Document
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

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, categoryFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getAll({ search: searchTerm, category: categoryFilter });
      setDocuments(response.data.documents);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedDocument) {
        await documentsAPI.update(selectedDocument._id, formData);
        toast.success('Document updated successfully');
      } else {
        await documentsAPI.create(formData);
        toast.success('Document added successfully');
      }
      setModalOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to save document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentsAPI.delete(id);
        toast.success('Document deleted successfully');
        fetchDocuments();
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const getFileIcon = (fileType) => {
    return <FiFile className="text-2xl" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' KB';
    return (bytes / 1024).toFixed(2) + ' MB';
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
          <h1 className="text-3xl font-bold text-gray-900">Files & Documents</h1>
          <p className="text-gray-600 mt-1">Manage your business documents</p>
        </div>
        <button
          onClick={() => {
            setSelectedDocument(null);
            setModalOpen(true);
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Document</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-blue-100 mb-2">Total Documents</h3>
          <p className="text-4xl font-bold">{documents.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-green-100 mb-2">Contracts</h3>
          <p className="text-4xl font-bold">{documents.filter(d => d.category === 'contract').length}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-purple-100 mb-2">Invoices</h3>
          <p className="text-4xl font-bold">{documents.filter(d => d.category === 'invoice').length}</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <h3 className="text-orange-100 mb-2">Reports</h3>
          <p className="text-4xl font-bold">{documents.filter(d => d.category === 'report').length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input md:w-48"
          >
            <option value="">All Categories</option>
            <option value="contract">Contract</option>
            <option value="invoice">Invoice</option>
            <option value="receipt">Receipt</option>
            <option value="report">Report</option>
            <option value="presentation">Presentation</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <div key={document._id} className="card hover:shadow-lg transition-all duration-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                {getFileIcon(document.fileType)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{document.name}</h3>
                <p className="text-sm text-gray-600 uppercase">{document.fileType}</p>
              </div>
              <span className="badge badge-primary capitalize">{document.category}</span>
            </div>

            {document.description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{document.description}</p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium text-gray-900">{formatFileSize(document.fileSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploaded:</span>
                <span className="font-medium text-gray-900">{formatDate(document.createdAt)}</span>
              </div>
              {document.tags && document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {document.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn btn-secondary text-sm py-2 flex items-center justify-center"
              >
                <FiDownload className="mr-1" /> Download
              </a>
              <button
                onClick={() => {
                  setSelectedDocument(document);
                  setModalOpen(true);
                }}
                className="btn btn-primary text-sm py-2"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDelete(document._id)}
                className="btn btn-danger text-sm py-2"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="card text-center py-12">
          <FiFileText className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-gray-500">No documents found. Click "Add Document" to upload one.</p>
        </div>
      )}

      <DocumentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onSave={handleSave}
      />
    </div>
  );
};

export default Documents;

