# iKuuu 签到助手 - 安卓应用

一个简单易用的 React Native 安卓应用，帮助您快速签到 iKuuu VPN 账户，每日获取免费流量。

## ✨ 功能特性

- 🚀 **一键签到**：只需输入 Cookie，点击按钮即可完成签到
- 💾 **本地保存**：Cookie 仅保存在您的手机本地，安全可靠
- 📊 **签到历史**：自动记录最近 10 次签到结果
- 📱 **原生安卓应用**：完整的原生应用体验
- 🔐 **隐私保护**：无需上传任何数据到服务器

## 📦 下载安装

### 方式一：GitHub Releases（推荐）

访问 [Releases 页面](https://github.com/suh2j/ikuuu-checkin/releases) 下载最新版本的 APK 文件，直接安装到您的安卓手机。

### 方式二：手动构建

```bash
# 克隆仓库
git clone https://github.com/suh2j/ikuuu-checkin.git
cd ikuuu-checkin

# 安装依赖
npm install

# 构建 APK
npm run build-android-apk

# APK 文件位置：android/app/build/outputs/apk/release/
```

## 📖 使用说明

### 如何获取 Cookie？

#### 电脑端

1. 在 [iKuuu 官网](https://ikuuu.org) 登录您的账户
2. 按 `F12` 打开浏览器开发者工具
3. 点击 **Console**（控制台）选项卡
4. 输入以下命令并回车：
   ```javascript
   document.cookie
   ```
5. 复制显示的 Cookie 内容

#### 手机端（推荐使用 Via 浏览器）

1. 在手机上下载并安装 [Via 浏览器](https://viabrowser.com/)
2. 用 Via 浏览器打开 [iKuuu 官网](https://ikuuu.org) 并登录
3. 登录成功后，点击浏览器左上角的 **盾牌图标** ⚔️
4. 在弹出菜单中选择 **"查看 Cookies"** 或 **"View Cookies"**
5. 复制显示的 Cookie 内容

### 签到步骤

1. 打开 iKuuu 签到助手应用
2. 在 "iKuuu Cookie" 输入框中粘贴您的 Cookie
3. 点击 **"立即签到"** 按钮
4. 等待签到完成，查看结果提示
5. 签到成功后，您的 Cookie 会自动保存，下次无需重复输入

## ⚠️ 注意事项

- **Cookie 有效期**：Cookie 通常有一定的有效期，如果签到失败，请重新获取最新的 Cookie
- **隐私安全**：本应用完全运行在您的手机中，Cookie 不会被发送到任何第三方服务器
- **频率限制**：iKuuu 可能对签到频率有限制，建议每天签到一次
- **账号安全**：请勿将 Cookie 分享给他人，它相当于您的账号密钥
- **Cookie 过期**：如果多天未使用，Cookie 可能会过期，需要重新获取

## 🛠️ 技术栈

- **框架**：React Native
- **语言**：JavaScript
- **存储**：AsyncStorage（手机本地存储）
- **网络**：Axios
- **构建**：Gradle + React Native CLI

## 📝 项目结构

```
.
├── App.js                          # 主应用组件
├── index.js                        # 应用入口
├── app.json                        # 应用配置
├── package.json                    # 项目依赖
├── babel.config.js                 # Babel 配置
├── android/                        # 安卓项目
│   ├── app/
│   │   ├── build.gradle           # 应用构建配置
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       ├── java/
│   │   │       │   └── com/ikuuucheckin/
│   │   │       │       ├── MainActivity.java
│   │   │       │       └── MainApplication.java
│   │   │       └── res/
│   │   │           └── values/
│   │   │               ├── strings.xml
│   │   │               └── styles.xml
│   │   └── proguard-rules.pro
│   ├── build.gradle
│   ├── gradle.properties
│   └── settings.gradle
├── .github/
│   └── workflows/
│       └── build-apk.yml           # GitHub Actions 构建工作流
└── README.md
```

## 🚀 GitHub Actions 自动构建

本仓库配置了 GitHub Actions，每当有新的 Release 创建时，会自动构建 APK 文件。

### 如何触发构建？

1. 在 GitHub 上创建新的 Release
2. GitHub Actions 会自动开始构建
3. 构建完成后，APK 文件会自动上传到 Release 页面

## 📄 许可证

MIT License

## 🙏 致谢

感谢 iKuuu VPN 提供的服务。

---

**提示**：如果您觉得这个应用有帮助，请给个 Star ⭐ 支持一下！
