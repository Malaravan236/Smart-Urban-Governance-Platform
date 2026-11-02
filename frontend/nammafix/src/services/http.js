
const BASE = import.meta.env.VITE_API;

export const tokens = {
  get access() {
    return localStorage.getItem('access');
  },

  get refresh() {
    return localStorage.getItem('refresh');
  },

  set(access, refresh) {
    if (access) localStorage.setItem('access', access);
    if (refresh) localStorage.setItem('refresh', refresh);
  },

  clear() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  },
};

function send(path, { body, headers = {}, ...rest } = {}) {
  const h = { ...headers };

  if (tokens.access) {
    h.Authorization = `Bearer ${tokens.access}`;
  }

  let payload = body;

  if (body && !(body instanceof FormData)) {
    h['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  return fetch(`${BASE}${path}`, {
    ...rest,
    headers: h,
    body: payload,
  });
}

async function refreshAccess() {
  if (!tokens.refresh) return false;

  try {
    const res = await fetch(`${BASE}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: tokens.refresh,
      }),
    });

    if (!res.ok) return false;

    const data = await res.json();

    if (!data.access) return false;

    tokens.set(data.access);

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

export async function http(path, opts = {}) {
  let res = await send(path, opts);

  if (res.status === 401 && tokens.access) {
    const refreshed = await refreshAccess();

    if (refreshed) {
      res = await send(path, opts);
    } else {
      tokens.clear();
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Session expired. Please login again.');
    }
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 429) {
    throw new Error(
      'Too many requests. Wait a minute and try again.'
    );
  }

  if (!res.ok) {
    const msg =
      data.detail ||
      data.msg ||
      data.error ||
      Object.values(data).flat().join(' ') ||
      `Request failed (${res.status})`;

    throw new Error(msg);
  }

  return data;
}
