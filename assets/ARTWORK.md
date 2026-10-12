# 示例素材

party.png 是为此界面通过内置 imagegen 工具生成的原创示例角色合影，供替换图片之前预览布局。未复制参考压缩包中的原版游戏图片、字体或音频。

界面通过 CSS 显示合影中的各个角色，没有覆盖或修改生成的原图。图片与构图提示保存在此模组内。

## 前线档案素材

以下两张图片于 2026-10-12 使用内置 imagegen，根据界面概念图分别生成独立插画图层，不是界面截图或截图裁切；文字、头像按钮、表单和装饰线仍由页面渲染。

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| [frontline-landscape.png](frontline-landscape.png) | 1536 × 1024 | 白底浅灰山脉与废墟山城，作为前线档案的背景插画 |
| [frontline-ranger.png](frontline-ranger.png) | 1024 × 1536 | 暗森林中的白发精灵游侠，作为前线档案的高清默认游侠图片 |

`paintArt()` 在正在渲染 `frontline`、当前图片路径为 `@/assets/party.png` 且 `strip === 0`（示例合影第 1 分栏）时，使用高清游侠图。这同时适用于满足条件的头像和大立绘；星轨剧场与绯歌序章的示例游侠头像也使用该图。不改写配置中的图片路径，用户自行设置的图片不会被替换；经典风格继续使用原有素材。

参考概念图文件名为 `exec-6208e655-1b05-4885-98de-05db1b0e33f5.png`。实际生成提示、游侠取景修正提示与字体生成方法见 [frontline-generation-prompts.txt](frontline-generation-prompts.txt)。

## 星轨剧场素材

以下两张图片于 2026-10-12 使用内置 imagegen，根据用户选定的「A · 星轨剧场」概念图（`portrait-login-A-orbital-theatre.png`）生成独立插画图层，均非界面截图裁切。文字、头像按钮、表单、椭圆景窗和星轨装饰由页面渲染。实际生成提示见 [orbital-generation-prompts.txt](orbital-generation-prompts.txt)。

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| [orbital-ranger.png](orbital-ranger.png) | 1254 × 1254，RGBA | 透明背景的白发精灵游侠，作为星轨剧场的默认游侠大立绘 |
| [orbital-woodland.png](orbital-woodland.png) | 1536 × 1024 | 暗色森林插画，作为星轨剧场的椭圆景窗背景 |

仅当大立绘取自 `@/assets/party.png`、`strip === 0` 且风格为 `orbital` 时，使用透明游侠素材。明确设置的自定义大立绘不会被替换；独立大立绘使用 `contain` 保持完整。

## 绯歌序章素材

[ballad-bard.png](ballad-bard.png) 为绯歌序章的透明背景诗人立绘，尺寸为 1024 × 1536，RGBA。它于 2026-10-12 依据用户提供的游戏宣传页 / 角色选择页参考图，通过内置 imagegen 生成独立插画图层。朱红角色列表、文字、登录表单及底部金色边饰由页面渲染。实际生成提示见 [ballad-generation-prompts.txt](ballad-generation-prompts.txt)。

[ballad-frame.svg](ballad-frame.svg) 是页面使用的矢量边框与朱红底形，包含底部金色装饰，不含人物或界面文字。

当风格为 `ballad`、当前图片取自 `@/assets/party.png` 且 `strip === 4` 时，使用诗人素材；示例游侠大立绘（`strip === 0`）复用 [orbital-ranger.png](orbital-ranger.png)，其他示例角色沿用合影分栏。明确设置的自定义图片不会被替换，配置中的原始路径保持不变。透明大立绘使用 `contain` 保持完整。

## 月林序章素材

[chronicle-backdrop.png](chronicle-backdrop.png) 为月林序章的独立无文字底图，尺寸为 1672 × 941。它于 2026-10-12 根据用户提供的游戏宣传页与角色选择页参考图，通过内置 imagegen 生成，包含左侧朱红森林与城堡、中央青绿植物花窗、右侧奶油纸色留白和底部金色边饰。底图不含角色、头像、文字或登录控件，这些内容由页面独立渲染；没有将完整参考界面作为截图背景使用。实际生成提示见 [chronicle-generation-prompts.txt](chronicle-generation-prompts.txt)。

[chronicle-ranger.png](chronicle-ranger.png) 为从同一参考图通过内置 imagegen 提取的独立游侠立绘，尺寸为 1254 × 1254，RGBA，具有透明背景。保留白发精灵游侠的回眸姿态、深绿金纹斗篷和长弓，按上半身构图展示。仅当风格为 `chronicle`、当前图片取自 `@/assets/party.png` 且 `strip === 0` 时，用于示例游侠的大立绘与头像。

月林序章的示例诗人复用 [ballad-bard.png](ballad-bard.png)，其余没有独立素材的示例角色仍使用 [party.png](party.png) 的对应分栏。风格素材只替换取自 `@/assets/party.png` 的示例，不改写配置图片路径，不替换自定义头像或大立绘；经典风格仍使用原始素材。月林序章的示例大立绘采用半身构图，自定义独立大立绘保留完整展示与配置的垂直位置。

## 本地标题字体

[fonts/frontline-black.woff2](fonts/frontline-black.woff2) 为 Noto Sans SC 的静态 900 字重，用于前线档案的角色粗黑标题。它从完整 Noto Sans SC 可变字体固定 `wght=900` 后转换为 WOFF2，没有按示例文案裁切字符子集；保留源字体的 31,036 个字形与 30,890 个 Unicode 码位。

字体遵循 SIL Open Font License 1.1，许可文本保存在 [fonts/OFL.txt](fonts/OFL.txt)，来源为 [Google Fonts 的 Noto Sans SC 许可](https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/OFL.txt)。

### 星轨剧场宋体

[fonts/orbital-serif.woff2](fonts/orbital-serif.woff2) 为 Noto Serif SC 的静态 400 字重，用于星轨剧场的宋体标题与正文。源文件于 2026-10-12 从 [Google Fonts 官方仓库](https://github.com/google/fonts/tree/main/ofl/notoserifsc) 下载，文件为 [NotoSerifSC\[wght\].ttf](https://github.com/google/fonts/blob/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf)，源文件 SHA-256 为 `050080d9255a86808f2945bffac582b31ef32bc36411ce29563b4961670c66f9`。

绯歌序章与月林序章复用此本地宋体，用于角色列表、标题、介绍与登录区。

使用 fontTools 4.60.2 与 Brotli 1.2.0 固定 `wght=400`、更新静态字体名称并转换为 WOFF2，未调用字符子集工具；保留官方源文件的全部 31,058 个字形和 30,928 个 Unicode 码位。转换后核对字符映射、字形顺序与源文件一致，无 `fvar` 可变轴，`OS/2.usWeightClass` 为 400。

输出为 Noto Serif SC Regular，5,732,800 字节，SHA-256 为 `88862bab4db2c4e8d00db97281a62f16ae11a937c62381f529239170c2cc2e73`。字体由模组本地提供，页面无需连接字体服务。

字体遵循 SIL Open Font License 1.1。许可原文单独保存在 [fonts/OFL-NotoSerifSC.txt](fonts/OFL-NotoSerifSC.txt)，来源为 [Google Fonts 的 Noto Serif SC 许可](https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/OFL.txt)；保留前线档案字体的原有许可文件。
