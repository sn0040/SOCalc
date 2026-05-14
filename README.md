# 铃兰之剑 · 伤害计算器

《铃兰之剑》游戏伤害计算工具，支持直伤、穿伤、DOT 三种伤害类型。

## 启动

直接用浏览器打开 HTML 文件（需要 HTTP 服务，ES Modules 不支持 `file://`）：

```bash
# Python
python -m http.server 8000
# 然后访问 http://localhost:8000
```

或使用 VS Code Live Server 等工具。

## 功能

- **直伤计算器** (`damage/index.html`) — 含攻击/防御/增伤/易伤/暴击/最终增伤/最终易伤区间
- **穿伤计算器** (`penetration/index.html`) — 支持单攻/双攻结算，含生命百分比伤害
- **DOT计算器** (`dot/index.html`) — 支持标准DOT/生命流失/伤痕撕裂/生命百分比多种模式
- **记录管理** — 保存/读取/删除/多选对比/截图对比
- **职业天赋参考** (`talent.html`) — 全职业天赋效果速查表

## 技术栈

纯前端：HTML + CSS + Vanilla JS ES Modules，无构建工具、无外部依赖。

## 项目结构

```
SOCalc/
├── index.html              # 导航首页
├── talent.html             # 职业天赋参考
├── common/                 # 共享模块
│   ├── recordManager.js    # 记录管理（三个计算器共用）
│   ├── gameData.js         # 游戏常量
│   ├── utils.js            # 工具类（CustomEntryList）
│   ├── dialog.js           # 自定义对话框
│   ├── conversion.js       # 攻击转化
│   ├── screenshot.js       # 截图功能
│   └── common.css          # 公共样式
├── damage/                 # 直伤计算器
│   ├── calc.js             # 纯计算公式
│   └── calculator.js       # UI + 编排
├── penetration/            # 穿伤计算器
│   ├── calc.js             # 纯计算公式
│   └── calculator.js       # UI + 编排
└── dot/                    # DOT计算器
    ├── calc.js             # 纯计算公式
    └── calculator.js       # UI + 编排
```
