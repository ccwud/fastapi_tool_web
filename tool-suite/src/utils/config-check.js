import { API_CONFIG, getBaseURL } from './api.js'

/**
 * 检查API配置是否正确
 */
export const checkApiConfig = () => {
  const baseURL = getBaseURL()
  
  console.group('🔧 API Configuration Check')
  console.log('Environment:', API_CONFIG.isDevelopment ? 'Development' : 'Production')
  console.log('Base URL:', baseURL)
  console.log('App Title:', API_CONFIG.APP_TITLE)
  console.log('Environment Variables:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE
  })
  console.groupEnd()
  
  return {
    baseURL,
    isValid: !!baseURL,
    environment: API_CONFIG.isDevelopment ? 'development' : 'production'
  }
}

/**
 * 测试API连接
 */
export const testApiConnection = async () => {
  try {
    const baseURL = getBaseURL()
    const response = await fetch(`${baseURL}/`)
    
    if (response.ok) {
      console.log('✅ API server is reachable')
      return true
    } else {
      console.warn('⚠️ API server responded with status:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Failed to connect to API server:', error.message)
    return false
  }
}
