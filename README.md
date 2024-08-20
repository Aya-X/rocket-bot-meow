# rocket-bot-meow

## 基本概要

- 火箭隊培訓營 Discord 伺服器用的機器人 (ฅ'ω'ฅ) Meow

## 功能說明

- 根據使用者輸入的關鍵字賦予對應的角色

- 可根據新人、畢業、彩蛋的身份回應不同的歡迎訊息

- 新人輸入關鍵字後，會自動將新人加入對應的組別，並移除其新手組別

- 任何人輸入某梯畢業的關鍵字後，會自動將該梯次的全體人員加入新的組別，並移除該梯的新手組別

## 專案結構

```markdown
.
├── src
│ ├── constants
│ │ ├── index.ts
│ ├── events  
│ │ ├── index.ts
│ ├── utils  
│ │ ├── messageUtils
│ │ │ ├── index.ts
│ │ ├── roleUtils
│ │ │ ├── index.ts
│ ├── index.ts
├── .env.example
├── ...
.
```

- `src/constants`：梯次、組別相關常數
- `src/utils/messageUtils`：回覆的歡迎訊息字串

## 安裝專案

1. Clone

   ```bash
   git clone https://github.com/Aya-X/rocket-bot-meow.git
   cd rocket-bot-meow
   ```

2. Install

   ```bash
   pnpm install
   ```

3. Environment

   ```bash
   cp .env.example .env
   ```

## 使用方法

1. Compile

   ```bash
   pnpm run build
   ```

2. Start

   ```bash
   pnpm run start
   ```

---
