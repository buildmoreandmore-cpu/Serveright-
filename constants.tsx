
import React from 'react';

export const COLORS = {
  navy: '#1a2b4a',
  slate: '#4a5568',
  teal: '#0d9488',
  success: '#059669',
  pending: '#d97706',
  error: '#dc2626',
  neutral: '#9ca3af',
  bg: '#fafafa',
  white: '#ffffff',
  depth: '#f3f4f6'
};

export const COUNTY_RATES: Record<string, number> = {
  'Fulton': 85,
  'DeKalb': 85,
  'Gwinnett': 85,
  'Cobb': 85,
  'Clayton': 95,
  'Henry': 95,
  'Douglas': 95,
  'Rockdale': 105
};

export const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Request Received',
  ASSIGNED: 'Server Assigned',
  IN_PROGRESS: 'In Progress',
  ATTEMPTED: 'Attempt Made',
  COMPLETE: 'Complete',
  ATTENTION_NEEDED: 'Attention Needed',
  OVERDUE: 'Overdue'
};
