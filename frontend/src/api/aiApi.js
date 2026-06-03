import api from './axiosInstance';

export const aiApi = {
  chat: (message) =>
    api.post('/api/ai/chat', { message }).then(r => r.data.response),

  analyzeDiary: (content) =>
    api.post('/api/ai/analyze-diary', { content }).then(r => r.data.analysis),

  analyzeDream: (content) =>
    api.post('/api/ai/analyze-dream', { content }).then(r => r.data.analysis),

  getDailyAdvice: () =>
    api.get('/api/ai/daily-advice').then(r => r.data.advice),

  getCbtExercise: (mood) =>
    api.post('/api/ai/cbt-exercise', { mood }).then(r => r.data.exercise),
};

export default aiApi;
