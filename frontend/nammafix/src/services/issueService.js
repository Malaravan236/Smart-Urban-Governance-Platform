import { http } from './http';

const post = (path, body) =>
  http(path, { method: 'POST', body });

export const listIssues = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v != null
    )
  );

  return http('/api/issues/?' + new URLSearchParams(clean));
};

export const getIssue = (id) =>
  http(`/api/issues/${id}/`);

export const createIssue = (formData) =>
  post('/api/issues/', formData);

export const supportIssue = (id) =>
  post(`/api/issues/${id}/support/`);

export const unsupportIssue = (id) =>
  post(`/api/issues/${id}/unsupport/`);

export const addComment = (id, text) =>
  post(`/api/issues/${id}/comments/`, { text });

export const myReports = () =>
  http('/api/issues/my_reports/');

export const nearbyIssues = (lat, lon, radius = 2) =>
  http(`/api/issues/nearby/?lat=${lat}&lon=${lon}&radius=${radius}`);

export const analytics = () =>
  http('/api/issues/analytics/');

export const resolveIssue = (id, status, remarks) =>
  post(`/api/issues/${id}/resolve/`, { status, remarks });

export const deleteIssue = (id) =>
  http(`/api/issues/${id}/`, {
    method: 'DELETE',
  });