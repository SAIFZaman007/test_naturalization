export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
  },
  trades: {
    getAll: "/trades",
    create: "/trades",
    getById: (id) => `/trades/${id}`,
  },
  dashboard: {
    kpis: "/dashboard/kpis",
  },
  reflections: {
    getAll: "/api/reflections",
    create: "/api/reflections",
    getById: (id) => `/api/reflections/${id}`,
    update: (id) => `/api/reflections/${id}`,
    delete: (id) => `/api/reflections/${id}`,
    promptState: "/api/reflections/prompt-state",
    analytics: "/api/reflections/trade-log",
    byQuestionId: (questionId) => `/api/reflections/by-question/${questionId}`,
  },
};
