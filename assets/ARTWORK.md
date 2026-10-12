# 示例素材

party.png 是为此界面通过内置 imagegen 工具生成的原创示例角色合影，供替换图片之前预览布局。未复制参考压缩包中的原版游戏图片、字体或音频。

界面通过 CSS 显示合影中的各个角色，没有覆盖或修改生成的原图。图片与构图提示保存在此模组内。

## 前线档案素材

以下两张图片于 2026-10-12 使用内置 imagegen，根据界面概念图分别生成独立插画图层，不是界面截图或截图裁切；文字、头像按钮、表单和装饰线仍由页面渲染。

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| [frontline-landscape.png](frontline-landscape.png) | 1536 × 1024 | 白底浅灰山脉与废墟山城，作为前线档案的背景插画 |
| [frontline-ranger.png](frontline-ranger.png) | 1024 × 1536 | 暗森林中的白发精灵游侠，作为前线档案的高清默认游侠图片 |

`paintArt()` 仅在正在渲染 `frontline`、当前图片路径为 `@/assets/party.png` 且 `strip === 0`（示例合影第 1 分栏）时，使用高清游侠图。这同时适用于满足条件的头像和大立绘，不改写配置中的图片路径。用户自行设置的图片不会被替换；经典风格继续使用原有素材。

参考概念图文件名为 `exec-6208e655-1b05-4885-98de-05db1b0e33f5.png`。实际生成提示、游侠取景修正提示与字体生成方法见 [frontline-generation-prompts.txt](frontline-generation-prompts.txt)。

## 本地标题字体

[fonts/frontline-black.woff2](fonts/frontline-black.woff2) 为 Noto Sans SC 的静态 900 字重，用于前线档案的角色粗黑标题。它从完整 Noto Sans SC 可变字体固定 `wght=900` 后转换为 WOFF2，没有按示例文案裁切字符子集；保留源字体的 31,036 个字形与 30,890 个 Unicode 码位。

字体遵循 SIL Open Font License 1.1，许可文本保存在 [fonts/OFL.txt](fonts/OFL.txt)，来源为 [Google Fonts 的 Noto Sans SC 许可](https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/OFL.txt)。
