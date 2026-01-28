import api from './api';

/**
 * Get all dashboards for the current user
 */
export const getDashboards = async () => {
  const response = await api.get('/api/dashboards');
  return response.data.dashboards;
};

/**
 * Get a single dashboard by ID with its charts
 */
export const getDashboard = async (id) => {
  const response = await api.get(`/api/dashboards/${id}`);
  return response.data.dashboard;
};

/**
 * Create a new dashboard
 */
export const createDashboard = async (data) => {
  const response = await api.post('/api/dashboards', data);
  return response.data.dashboard;
};

/**
 * Update a dashboard
 */
export const updateDashboard = async (id, data) => {
  const response = await api.put(`/api/dashboards/${id}`, data);
  return response.data.dashboard;
};

/**
 * Delete a dashboard
 */
export const deleteDashboard = async (id) => {
  const response = await api.delete(`/api/dashboards/${id}`);
  return response.data;
};

/**
 * Add a chart to a dashboard
 */
export const addChart = async (dashboardId, chartSpec) => {
  const response = await api.post(`/api/dashboards/${dashboardId}/charts`, { spec: chartSpec });
  return response.data.chart;
};

/**
 * Update a chart
 */
export const updateChart = async (dashboardId, chartId, chartSpec) => {
  const response = await api.put(`/api/dashboards/${dashboardId}/charts/${chartId}`, {
    spec: chartSpec,
  });
  return response.data.chart;
};

/**
 * Delete a chart
 */
export const deleteChart = async (dashboardId, chartId) => {
  const response = await api.delete(`/api/dashboards/${dashboardId}/charts/${chartId}`);
  return response.data;
};