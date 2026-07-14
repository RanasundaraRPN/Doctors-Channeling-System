const API_BASE_URL = '/api';

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('medichannel_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('medichannel_token');
            localStorage.removeItem('medichannel_user');
            window.location.href = '/'; // Force redirect to login
            throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Something went wrong');
    }

    return response.json();
};
