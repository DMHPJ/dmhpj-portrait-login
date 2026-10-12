# 项目维护指南

本文面向维护 `portrait-login` 的开发者与编码助手。使用说明、安装命令和配置字段见 [README.md](README.md)。修改前先阅读本文件及与任务有关的源码，以实际实现为准。

## 项目定位

- 模组名称：冒险者之门 · 角色立绘登录；ID：`portrait-login`；当前版本：`1.0.0`。
- 当前目标版本为 Foundry VTT **13.351**。接入工具会检查程序 `package.json` 中的 `name`、`release.generation` 和 `release.build`，拒绝其他版本。
- 这是直接运行的 JavaScript ES Modules 与 CSS 项目，没有 `package.json`、依赖安装流程、打包步骤或自动化测试框架。
- 世界内配置界面和未登录时的主题是两个入口。`module.json` 只声明 `settings.mjs` 与 `settings.css`；登录页通过 `tools/install.mjs` 修改 Foundry 的 `templates/views/join.hbs` 接入。

## 文件职责

| 文件 | 职责 |
| --- | --- |
| `module.json` | 模组标识、兼容性、世界内入口、持久存储声明 |
| `scripts/model.mjs` | 默认数据、风格与布局预设、配置规范化、文本转义、资源 URL、图片显示逻辑 |
| `scripts/settings.mjs` | `ApplicationV2` 配置窗口、账户绑定、导入导出、GM 发布 |
| `scripts/login.mjs` | 配置加载、角色展示、原生账户联动、DOM 更新监听、回退 |
| `scripts/scene.mjs` | 登录页与全屏编辑器共用的场景、文本和布局渲染 |
| `styles/scene.css` | 共用布局、主题变量、角色卡、减少动画适配与风格样式导入 |
| `styles/frontline.css` | 前线档案的场景、角色列表、登录表单与编辑器样式 |
| `styles/orbital.css` | 星轨剧场的景窗、星轨、立绘、角色列表、登录表单与编辑器样式 |
| `styles/ballad.css` | 绯歌序章的朱红角色列表、立绘、宋体介绍、登录表单、金色边饰与编辑器样式 |
| `styles/chronicle.css` | 月林序章的左侧朱红简介、中央花窗立绘、右侧头像列表、底部横向登录表单与编辑器样式 |
| `styles/archive/2026-10-12/` | 经典风格 CSS 快照，仅供归档比较，不参与运行加载，不覆盖已有归档 |
| `styles/login.css` | 登录页全屏与禁用页面滚动、原生界面覆盖 |
| `styles/settings.css` | 世界内配置窗口样式 |
| `tools/install.mjs` | 模板接入、检查、备份与恢复，仅使用 Node.js 内置模块 |
| `config.json` | 没有已发布世界配置时的默认示例 |
| `storage/` | GM 发布的各世界配置；更新时保留 |
| `assets/` | 五角色示例合影、素材说明与生成提示 |
| `测试结果.json`、`使用说明.md` | 历史验证记录与使用说明；其中本机信息不是当前环境保证 |

## 修改前确认

1. 明确本次影响的是登录页、世界内设置、共享数据还是安装工具，阅读对应入口和共享模型。
2. 检查现有文件及用户改动；不要假定存在 Git 仓库、可运行的 Foundry 服务、历史演示世界或历史说明中的安装目录。
3. 对多步任务给出简短步骤与验证方式。常规且可逆的实现选择自行决定；只有会实质影响需求、目标或权限的缺失信息才需要澄清。
4. 限定改动范围，不顺带重排压缩样式、整体格式化、引入框架或修复无关问题。

## 必须保留的行为边界

### 原生登录

- 保留 Foundry 的表单提交、密码验证、会话、错误提示和跳转。角色卡只联动原生账户选择，不实现独立认证。
- 登录脚本依赖 `#join-game`、`#join-game-form`、`[name="userid"]`、`[name="password"]`、账户选项的 `disabled` 状态；升级兼容性时必须在目标版本实测这些约定。
- 角色卡导致账户变化时清空密码，不能选中已禁用的在线账户。维持手动选择账户、服务器管理入口和原始界面回退。
- `portraitLoginOff` 查询参数只要存在就跳过增强；常用写法为 `?portraitLoginOff=1`。
- 页面由 Foundry 动态渲染。保留重复挂载检查、监听器清理和异常时撤销主题的处理；新增观察行为应避免自身 DOM 更新触发循环。

### 配置与公开数据

- 配置入口统一调用 `normalize()`。配置结构发生变化时检查默认数据、编辑器读写、导入导出、发布和登录渲染，避免字段只在某一端生效。
- 默认示例同时存在于 `model.mjs` 的 `defaults` 和根目录 `config.json`，均保留 `classic`。有意修改共同默认内容时同步两处。静态 `preview.html` 默认展示月林序章的游侠，通过 `style` 查询参数或风格下拉框对比五种风格，不修改世界配置。
- 角色 `uiStyle` 支持 `classic`（默认）、`frontline`、`orbital`（星轨剧场）、`ballad`（绯歌序章）和 `chronicle`（月林序章）；缺失或未知值回退至 `classic`。经典风格保留原 `layout`：全局 `eyebrow/login/roster` 为共享布局，角色 `name/tag/hero/description/detail` 为独立布局。前线档案、星轨剧场、绯歌序章与月林序章分别使用全局与角色的可选 `styleLayouts.frontline`、`styleLayouts.orbital`、`styleLayouts.ballad`、`styleLayouts.chronicle`，未设置的项读取各自 `STYLE_LAYOUTS` 预设，仅实际修改、引用或重置布局时写入。切换风格不得覆盖任何风格的布局；重置只作用于当前风格；引用把来源角色当前风格布局复制到目标角色当前风格，不切换目标 `uiStyle`。
- 布局位置按视口百分比、缩放按倍数保存；编辑器与登录页复用 `scene.mjs` 和样式入口。当前仅考虑桌面，join 页面固定一屏、不滚动；经典角色列表横向滚动，前线档案、星轨剧场、绯歌序章与月林序章纵向滚动。
- 登录页读取顺序为 `storage/<世界ID>.json` → `config.json` → 内置 `defaults`，请求不使用缓存；当前页面加载后需刷新才会重新读配置。
- 编辑器从世界设置 `portrait-login.config` 读取；发布先通过 `FilePicker.implementation.uploadPersistent()` 写公开 JSON，再保存世界设置。不要把世界设置与公开文件视为自动同步或原子写入。
- `storage/` 是需要保留的用户数据。不要清空、覆盖其他世界文件，或把本机真实世界配置加入示例。
- 发布 JSON 包含账户 ID、图片路径、角色文案以及被隐藏的角色。`enabled: false` 只影响展示，不保护秘密信息。不要将密码、令牌或私密角色资料写入配置。
- 保持菜单限制与保存时的 GM 权限检查。导入已分配角色只提取当前实现需要的名字、图片与账户关联，不扩展为公开完整 Actor 数据。

### 文本、资源与样式

- 动态文字使用 `textContent`；插入配置窗口 HTML 的用户值使用共享 `escape()`。不要直接拼接未转义的用户内容。
- 月林序章将含中点的角色姓名分行展示，配置中的原始姓名保持不变；进入文字编辑时先从配置恢复原始 `textContent`，保留中点和原有换行。
- 图片地址通过 `assetURL()` 处理：`@/` 相对模组目录，其他相对路径基于 Foundry 服务根路径；允许 HTTP(S)，拒绝本机盘符与危险协议。保持反向代理子路径下的 URL 解析方式。
- `strip` 为 `0–4` 时使用五等分示例图；自定义图片应设为 `null`。显式提供 `hero` 时大立绘不分栏；`position: 0` 是有效值。
- `paintArt()` 只对取自 `@/assets/party.png` 的示例分栏使用风格素材：`frontline` 的示例游侠（`strip === 0`）使用 `frontline-ranger.png`；`orbital` 与 `ballad` 的示例游侠大立绘使用透明的 `orbital-ranger.png`，头像使用 `frontline-ranger.png`；`chronicle` 的示例游侠大立绘与头像使用独立透明素材 `chronicle-ranger.png`；`ballad` 与 `chronicle` 的示例诗人（`strip === 4`）使用透明的 `ballad-bard.png`。其他示例沿用合影分栏，不改配置图片路径，不替换用户自定义图片，经典风格仍使用原素材；星轨剧场和绯歌序章的独立大立绘使用 `contain` 保持完整，月林序章的示例大立绘按半身构图展示，自定义独立大立绘保持 `contain` 和配置的垂直位置。
- 月林序章的 `chronicle-backdrop.png` 是独立无文字插画底图；角色、文字、头像列表和登录控件由页面渲染。用户设置的背景仍由 `assetURL()` 解析，在中央人物区域显示。
- 保持 `.pl-*` 命名，登录样式尽量限制在 `body.pl-active` 下。前线档案、星轨剧场、绯歌序章与月林序章规则分别限定在 `[data-pl-style="frontline"]`、`[data-pl-style="orbital"]`、`[data-pl-style="ballad"]` 和 `[data-pl-style="chronicle"]`，场景与编辑器根节点随角色更新该属性。不要让主题样式影响其他风格或正常世界界面。
- 编辑器打开前会加载带版本标识的设置样式，以兼容世界页面残留的旧样式。修改这些样式时同步更新 `settings.mjs` 和 `preview.html` 的样式 URL、`settings.css` 与 `login.css` 的场景导入版本，以及 `scene.css` 中对应风格的导入版本（当前主入口与月林序章为 `20261012-chronicle-1`，前线档案、星轨剧场与绯歌序章保留各自版本）；用原生 `ApplicationV2` 检查新脚本与旧样式共存时的布局，不能只验证独立预览或 join 页面。
- 修改交互或布局时保留角色按钮的可访问名称、`aria-pressed`、状态播报、键盘左右切换、前线档案、星轨剧场、绯歌序章和月林序章的上下切换、可见焦点与减少动画支持。
- 界面文案使用简明中文，说明用户可执行的操作或当前状态；不要把调试过程和实现细节放进产品文案。

### 安装与恢复

- 保留对 13.351 的严格检查；单独放宽 `module.json` 不能证明支持新版本。
- 保留 `portrait-login:v1:start/end` 标记、首次备份、重复安装不重复注入、模板结构检查和备份冲突保护。
- 恢复时只移除本主题接入，保留其他模板改动；不要无条件拿备份覆盖现有模板。
- 当前接入作用于该 Foundry 程序的登录模板，不以世界是否启用模组为开关。卸载主题需要恢复模板。
- 未获对应操作授权时，不修改工作区外的真实 Foundry 程序或重启服务。测试安装器优先使用临时目录内的仿真模板，不能把仿真结果当成真实登录验证。

## 验证与交付

按改动范围选择验证，不为纯文档或微小样式修改建立额外测试框架。

语法检查（在项目根目录执行）：

```sh
node --check scripts/model.mjs
node --check scripts/scene.mjs
node --check scripts/login.mjs
node --check scripts/settings.mjs
node --check tools/install.mjs
```

| 改动范围 | 重点验证 |
| --- | --- |
| 文档 | 文件链接、命令、字段和默认值与源码一致；区分历史记录与本次验证 |
| 共享模型 | 默认配置、空列表、字段边界、`position: 0`、分栏、自定义图、URL 与文本处理；风格回退、布局独立保存与缺省预设 |
| 登录交互或样式 | 真实 13.351 下的 GM/玩家登录、错误密码、在线账户、切换账户、管理员入口、回退；桌面固定一屏、无页面滚动、键盘操作 |
| 配置窗口 | 全屏、八类元素拖动与缩放、双击文字编辑、布局持久化、风格切换与当前风格的重置/引用、增删排序、隐藏、账户绑定、图片浏览、导入导出、发布后刷新、不同世界配置隔离 |
| 安装器 | 临时模板下的版本拒绝、备份、重复安装、恢复、保留外部改动、备份冲突与不完整标记 |

`测试结果.json` 是已有测试结果摘要，没有可直接运行的测试用例。修改后仅报告实际执行的检查；未启动真实 Foundry 时，明确登录、发布和视觉效果尚未复验。交付说明包含修改内容、验证结果和未验证部分。
