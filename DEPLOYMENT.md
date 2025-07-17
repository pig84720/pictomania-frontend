# 🚀 GitHub Pages 自动部署指南

## 📋 准备工作

### 1. 检查 package.json 中的 homepage 字段
确保 `package.json` 中的 homepage 字段正确：
```json
"homepage": "https://你的GitHub用户名.github.io/pictomania-frontend"
```

**⚠️ 重要：** 请将 `你的GitHub用户名` 替换为您的实际 GitHub 用户名！

### 2. 推送代码到 GitHub
```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 3. 启用 GitHub Pages
1. 前往您的 GitHub 仓库
2. 点击 `Settings` 标签
3. 左侧菜单找到 `Pages`
4. 在 `Source` 选项中选择 `Deploy from a branch`
5. 选择 `gh-pages` 分支
6. 点击 `Save`

## 🎯 自动部署流程

### 触发条件
- 推送到 `main` 分支时自动触发
- Pull Request 时会测试构建但不部署

### 部署步骤
1. **检出代码** - 获取最新源代码
2. **设置 Node.js** - 安装 Node.js 18
3. **安装依赖** - `npm ci`
4. **构建项目** - `npm run build`
5. **部署到 gh-pages** - 自动推送到 gh-pages 分支

### 查看部署状态
- 前往 GitHub 仓库的 `Actions` 标签
- 查看最新的工作流运行状态
- 绿色 ✅ 表示部署成功，红色 ❌ 表示失败

## 🌐 访问您的网站

部署成功后，您可以通过以下地址访问：
```
https://你的GitHub用户名.github.io/pictomania-frontend
```

## 🔧 故障排除

### 常见问题：
1. **404 错误** - 检查 homepage 字段是否正确
2. **构建失败** - 检查 Actions 日志，通常是依赖问题
3. **页面空白** - 确认路径配置正确

### 调试步骤：
1. 检查 Actions 工作流日志
2. 确认 gh-pages 分支已创建
3. 检查 GitHub Pages 设置是否正确

## 📝 注意事项

- 首次部署可能需要几分钟生效
- 每次推送到 main 分支都会触发重新部署
- 部署过程完全自动化，无需手动干预 