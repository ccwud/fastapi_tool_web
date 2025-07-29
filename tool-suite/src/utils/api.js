import axios from 'axios'

// API配置
const API_CONFIG = {
  // 从环境变量获取API基础URL，如果没有则使用默认值
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  // 开发环境使用本地后端服务
  DEV_BASE_URL: 'http://localhost:8000',
  // 生产环境可以修改为服务器域名
  PROD_BASE_URL: 'https://your-domain.com',
  // 当前环境判断
  isDevelopment: import.meta.env.DEV,
  // 应用标题
  APP_TITLE: import.meta.env.VITE_APP_TITLE || '工具集合'
}

// 获取当前环境的API基础URL
const getBaseURL = () => {
  // 在开发环境下使用Vite代理，避免CORS问题
  if (API_CONFIG.isDevelopment) {
    return '/api'  // 使用Vite代理
  }

  // 生产环境优先使用环境变量中的配置
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL+'/api'
  }

  // 否则使用生产环境默认配置
  return API_CONFIG.PROD_BASE_URL+'/api'
}

// 创建axios实例
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // 允许跨域请求携带凭证
  withCredentials: false
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在开发环境下打印请求信息
    if (API_CONFIG.isDevelopment) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data
      })
    }
    // 可以在这里添加token等认证信息
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 在开发环境下打印响应信息
    if (API_CONFIG.isDevelopment) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      })
    }
    return response
  },
  error => {
    // 统一错误处理
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    })

    // 根据错误状态码进行不同处理
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('🔌 Network Error: Cannot connect to backend server.')
      console.log('💡 Please make sure the backend server is running at:', getBaseURL())
    } else if (error.response?.status === 404) {
      console.warn('⚠️ API endpoint not found. Please check if the backend server is running.')
    } else if (error.response?.status === 405) {
      console.warn('⚠️ Method not allowed. This might be a CORS issue.')
    } else if (error.response?.status >= 500) {
      console.error('🔥 Server error occurred.')
    }

    return Promise.reject(error)
  }
)

// 导出API实例和配置
export default api
export { API_CONFIG, getBaseURL }
