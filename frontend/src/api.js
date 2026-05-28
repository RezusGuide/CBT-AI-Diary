const BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_URL = (path) => {
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
};

export default API_URL;
