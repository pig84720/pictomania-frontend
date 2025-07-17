import axios from 'axios';
import { getRandomMockCards, checkCardAvailability } from './mockData';

// 配置API基礎URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 是否使用Mock資料的標誌
let useMockData = false;

// API難度鍵值到Mock資料鍵值的映射
const apiToMockKeyMap = {
  'green': 'easy',
  'orange': 'normal',
  'blue': 'hard',
  'yellow': 'extreme'
};

// 創建axios實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // 處理常見錯誤
    if (error.response?.status === 404) {
      throw new Error('API端點不存在');
    } else if (error.response?.status === 500) {
      throw new Error('伺服器內部錯誤');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('請求超時，請檢查網路連接');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('網路連接錯誤，請檢查後端是否正常運行');
    }
    
    return Promise.reject(error);
  }
);

// API函數

/**
 * 依照難度取得隨機三張不重複卡片
 * @param {string} difficulty - 難度等級 (green/orange/blue/yellow)
 * @returns {Promise<Array>} 卡片陣列
 */
export const getRandomCards = async (difficulty) => {
  // 將API難度鍵值映射到Mock資料鍵值
  const mockKey = apiToMockKeyMap[difficulty] || difficulty;
  
  // 如果已經確定使用Mock資料，直接返回
  if (useMockData) {
    console.log('使用Mock資料:', difficulty, '→', mockKey);
    return getRandomMockCards(mockKey);
  }

  try {
    const response = await apiClient.get('/cards/', {
      params: { difficulty }
    });
    return response.data;
  } catch (error) {
    console.error('API取得卡片失敗，切換到Mock資料:', error.message);
    
    // 設定使用Mock資料標誌
    useMockData = true;
    
    // 檢查Mock資料是否可用
    if (checkCardAvailability(mockKey)) {
      console.log('使用Mock資料作為fallback:', difficulty, '→', mockKey);
      return getRandomMockCards(mockKey);
    } else {
      throw new Error(`無法取得${difficulty}難度的卡片資料`);
    }
  }
};

/**
 * 新增一張卡片
 * @param {Object} card - 卡片資料
 * @returns {Promise<Object>} 新增的卡片資料
 */
export const createCard = async (card) => {
  try {
    const response = await apiClient.post('/cards/', card);
    return response.data;
  } catch (error) {
    console.error('新增卡片失敗:', error);
    throw error;
  }
};

// 測試API連接
export const testApiConnection = async () => {
  try {
    const response = await apiClient.get('/');
    return response.status === 200;
  } catch (error) {
    console.error('API連接測試失敗:', error);
    return false;
  }
};

export default apiClient; 