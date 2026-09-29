# 条形磁铁 3D 磁场互动课件

**直接使用：** https://zhangjinapr.github.io/bar-magnet-3d-lesson/  
**源码仓库：** https://github.com/zhangjinapr/bar-magnet-3d-lesson

## 使用与代码权利

欢迎通过上方网页直接使用本课件进行教学或学习。**本仓库不采用开源许可证，公开可见不代表代码免费授权。**源代码及课件设计的其他权利由“张专注物理”保留。除访问网页所必需的使用外，复制、修改、再发布、独立部署或销售代码须事先获得授权。详见 [RIGHTS.md](RIGHTS.md)。

打开网页即可旋转和缩放磁铁，切换水平剖面与 3D 空间磁感线，并观察竖直纸面上的 `·` / `×` 方向符号。网页所需代码全部打包进 `index.html`，访问者无需安装软件。

## 本地使用与修改

1. 安装 Node.js 和 Git。
2. 在本项目文件夹运行 `npm ci`，然后运行 `npm run build`。
3. 用浏览器打开 `index.html` 查看课件。
4. 修改 `app.js`（模型与交互）或 `template.html`（界面文字与样式）后，再运行 `npm run build`。

`dist/index.html` 是自动发布用文件。请提交源码和根目录的 `index.html`；`node_modules`、`dist` 和 `app.bundle.js` 不需要提交。

## 更新已发布网页

修改课件后运行 `npm run build`，再提交并推送到 `main`。仓库中的 GitHub Actions 会自动重新发布；在 **Actions** 页等待 `Deploy GitHub Pages` 显示成功。发布给学生或放入视频简介时，请使用上方“直接使用”的网页地址。

红端标 N、蓝端标 S 是课堂演示约定；原始实验照片未标明极性。磁感线按等效磁极模型绘制，是帮助理解空间方向的定性图示。
