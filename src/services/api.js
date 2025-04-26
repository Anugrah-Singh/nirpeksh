import axios from 'axios';

// Configure Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Proxy will handle '/api' -> 'http://localhost:5000/api' if configured in vite.config.js, otherwise use full URL e.g. 'http://localhost:5000/api'
  timeout: 100000, // Request timeout: 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Functions ---

// Replace with your actual backend endpoint
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    // Assuming the backend returns a token upon successful login
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data; // Contains token or user info
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    throw error; // Re-throw error to be caught in the component
  }
};

export const logoutUser = () => {
    localStorage.removeItem('authToken');
    // Optionally: redirect to login or inform backend
};

// Replace with your actual backend endpoint
export const getTopics = async () => {
  try {
    const response = await apiClient.get('/get_topics');
    // Assuming backend returns an array of topics: [{ topic_id, topic_name, ... },]
    return response.data;
  } catch (error) {
    console.error('Get Topics API error:', error.response?.data || error.message);
    throw error;
  }
};

// Replace with your actual backend endpoint
export const getTopicDetails = async (topicId) => {
  try {
    const response = await apiClient.get(`/get_topic/${topicId}`);
    
    // Assuming backend returns { topic_id, brief, perspective, related_articles: [{ article_id, article_name, URL, ... }] }
    return response.data;
  } catch (error) {
    console.error(`Get Topic Details API error (ID: ${topicId}):`, error.response?.data || error.message);
    throw error;
  }
};

// Replace with your actual backend endpoint
export const markArticleAsComplete = async (articleId) => {
  try {
    // Assuming the backend expects an empty body or specific format for completion
    const response = await apiClient.post(`/article/${articleId}/complete`);
    return response.data; // Or just status code check
  } catch (error) {
    console.error(`Mark Article Complete API error (ID: ${articleId}):`, error.response?.data || error.message);
    throw error;
  }
};

export default apiClient; // Export instance if needed elsewhere, though functions are preferred