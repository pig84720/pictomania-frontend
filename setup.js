#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 神來一筆 Pictomania 前端設置');
console.log('================================');

// 創建.env文件
const envContent = `# API 配置
REACT_APP_API_URL=http://localhost:8000

# 如果您的後端運行在不同的端口或域名，請修改上面的URL
# 例如：REACT_APP_API_URL=https://your-api-domain.com
`;

const envPath = path.join(__dirname, '.env');

try {
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env文件已存在，跳過創建');
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env文件創建成功');
  }
} catch (error) {
  console.log('⚠️  無法創建.env文件，請手動創建：');
  console.log(envContent);
}

console.log('\n📋 接下來的步驟：');
console.log('1. 確保您的後端API服務正在運行');
console.log('2. 檢查.env文件中的API URL是否正確');
console.log('3. 運行 npm start 啟動開發服務器');
console.log('4. 在瀏覽器中打開 http://localhost:3000');

console.log('\n🎮 享受遊戲！'); 