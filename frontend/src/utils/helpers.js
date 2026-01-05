import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '-';
  return format(new Date(date), formatStr);
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    completed: 'success',
    pending: 'warning',
    'in-progress': 'info',
    'on-hold': 'warning',
    cancelled: 'danger',
    inactive: 'danger',
    failed: 'danger',
  };
  return colors[status] || 'info';
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    urgent: 'danger',
  };
  return colors[priority] || 'info';
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const calculatePercentage = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min((current / target) * 100, 100).toFixed(2);
};

