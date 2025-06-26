// 简单的API测试脚本
const testApi = async () => {
  try {
    console.log('Testing API connection...')
    
    // 测试根路径
    const rootResponse = await fetch('http://127.0.0.1:8000/')
    console.log('Root endpoint:', await rootResponse.text())
    
    // 测试简繁体转换
    const traditionalResponse = await fetch('http://127.0.0.1:8000/api/v1/text/to-traditional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: '测试简体转繁体'
      })
    })
    
    if (traditionalResponse.ok) {
      const result = await traditionalResponse.json()
      console.log('Traditional conversion result:', result)
    } else {
      console.error('Traditional conversion failed:', traditionalResponse.status, await traditionalResponse.text())
    }
    
  } catch (error) {
    console.error('API test failed:', error)
  }
}

// 在Node.js环境中运行
if (typeof window === 'undefined') {
  // Node.js环境
  const fetch = require('node-fetch')
  testApi()
} else {
  // 浏览器环境
  window.testApi = testApi
}
