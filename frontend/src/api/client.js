const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    credentials: 'include',
    headers: {},
    ...options,
  };

  // Set JSON content-type for non-FormData bodies
  if (config.body && !(config.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  let res;
  try {
    res = await fetch(url, config);
  } catch {
    throw new Error('Unable to reach the API. Check that the backend is running and connected to MongoDB.');
  }

  // Handle 401 by redirecting admin routes to the login page.
  if (res.status === 401 && path.startsWith('/api/admin')) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }

  // Parse response
  const contentType = res.headers.get('content-type');
  const isJSON = contentType && contentType.includes('application/json');
  const data = isJSON ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === 'object' && (data.message || data.errors?.map((e) => e.message).join(', ')) ? (data.message || data.errors.map((e) => e.message).join(', ')) : `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData) => request(path, { method: 'POST', body: formData }),
};
