# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

《铃兰之剑》游戏伤害计算器，纯前端静态应用（HTML + CSS + Vanilla JS ES Modules），无构建工具、无包管理、无需服务端。支持 3 种伤害计算类型，每个计算器独立运行。

## 启动方式

直接用浏览器打开 HTML 文件即可，无需任何构建步骤：
- `index.html` — 导航首页（含简易密码验证）
- `damage/index.html` — 直伤计算器
- `penetration/index.html` — 穿伤计算器
- `dot/index.html` — DOT计算器

推荐用 Live Server 或类似工具提供本地 HTTP 服务（ES Modules 需要 `http://` 协议而非 `file://`）。

## 项目结构

```
SOCalc/
├── index.html              # 导航首页（密码验证 + 退出登录按钮）
├── talent.html             # 职业天赋明细参考表
├── common/
│   ├── common.css          # 所有计算器共用样式
│   ├── screenshot.js       # 截图功能模块（html2canvas 懒加载）
│   ├── conversion.js       # 通用攻击转化模块
│   ├── utils.js            # 通用工具（escapeHtml, CustomEntryList 类）
│   ├── gameData.js         # 游戏常量（塔罗/职业天赋/克制系数等）
│   ├── recordManager.js    # 记录管理公共模块（三个计算器共用）
│   └── dialog.js           # 轻量对话框（替换原生 prompt/confirm/alert）
├── damage/
│   ├── index.html          # 直伤计算器 UI
│   ├── calculator.js       # 直伤：输入收集 + 渲染 + 计算编排
│   ├── calc.js             # 直伤：纯伤害计算公式
│   └── style.css
├── penetration/
│   ├── index.html          # 穿伤计算器 UI
│   ├── calculator.js       # 穿伤：输入收集 + 渲染 + 计算编排
│   ├── calc.js             # 穿伤：纯伤害计算公式
│   └── style.css
└── dot/
    ├── index.html          # DOT计算器 UI
    ├── calculator.js       # DOT：输入收集 + 渲染 + 计算编排
    ├── calc.js             # DOT：纯伤害计算公式
    └── style.css
```

## 架构模式

每个计算器分为三层：

```
collectInputs()  →  calc.js/calculateXxx()  →  renderResults()
 读取 DOM        纯计算（无DOM访问）          写回 DOM
```

- **`calc.js`** — 导出纯函数 `calculateDamage()` / `calculatePenetration()` / `calculateDot()`，接收平面输入对象，返回平面结果对象。可独立使用（测试、批量对比等场景）
- **`calculator.js`** — 三件事：`collectInputs()` 收集全部表单值，`updateAll()` 编排计算，`renderResults()` 写 DOM

其他公共模块：
- **`common/recordManager.js`** — 记录管理公共模块。三个计算器的保存/读取/删除/对比/截图功能统一由 `createRecordManager(config)` 工厂管理。**修改记录功能只需改此文件，不用碰三个 calculator.js**
- **`common/dialog.js`** — 轻量对话框，`showPrompt()` / `showConfirm()` / `showToast()` 替换原生 `prompt/confirm/alert`
- **`common/utils.js`** — `CustomEntryList` 类，统一管理动态自定义条目（减少 ~1100 行重复渲染代码）
- **`common/gameData.js`** — 游戏常量集中管理（塔罗牌、职业天赋、克制系数等），新增角色/装备效果只需改此文件
- **`common/conversion.js`** — 攻击转化弹窗管理器
- **`common/screenshot.js`** — html2canvas 懒加载（多 CDN 回退）

## 伤害公式

每个计算器的公式在各自 HTML 页面的 `.badge-reference` 中有标注，核心为分乘区计算：攻击 → 防御 → 增伤 → 易伤 → 暴击/最终增伤/最终易伤。

## 修改规则

- **记录相关功能**（UI、存储、对比、截图）→ 改 `common/recordManager.js`，三个计算器自动生效
- **游戏数据**（塔罗数值、职业加成等）→ 改 `common/gameData.js`
- **伤害公式** → 改各计算器的 `calc.js`
- **UI 布局/样式** → 改各计算器的 `index.html` 和 `style.css`，公共样式在 `common/common.css`
- 每个 `calculator.js` 中调用了 `createRecordManager()`，config 参数包含该计算器的特有设置（fieldMeta、formatFieldValue、选项标签映射、按钮 ID 等）

## 关键约定

- 所有百分比相关的 input/select 值为整数（如 20 表示 20%），函数内部除以 100
- 自定义条目统一使用 `{ name: string, percent: number }`（固定值减防用 `{ name, value }`）
- 对比表中的字段显示由 `formatFieldValue()` + `SELECT_LABELS` 控制。如需新增/修改选项标签映射，改对应计算器里的 `SELECT_LABELS` 对象
- `_` 开头的字段名（如 `_finalDisplayAtk`）为计算汇总值，存储在 config 中但不写入 DOM input
- 无任何外部依赖（运行时加载 html2canvas 仅用于截图功能）
- 默认 base attack 3000，base def 1500，skill multiplier 100%
- 代码中无测试、无类型检查、无 lint
- **选项布局规则**：每个 `<div class="row">` 内必须恰好 2 个 `<div>` 子元素（形成两列网格）。单选时另一个 `<div>` 留空 `<div></div>`
- **版本号自动更新**：`common/version.js` 是唯一版本来源。每次改动代码后自动递增，规则如下：

  | 变化类型 | 更新操作 |
  |---|---|
  | 修 bug、UI 微调、文案错误、**新增选项字段**、选项值调整 | patch +1 |
  | 新增计算器、架构重构、破坏性变更 | minor +1（patch 归零） |
  | 伤害公式重写、大规模重构 | major +1（minor 和 patch 归零） |

  patch 达到 10 时自动进位：patch 归零，minor +1
