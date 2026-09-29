# 条形磁铁 3D 磁场互动课件

**私有源码仓库：** https://github.com/zhangjinapr/bar-magnet-3d-lesson  
**在线交付：** 暂停。仓库改为私有后，原 GitHub Pages 链接已下线；确定销售与访问方式后再发布。

## 使用与代码权利

本项目拟以付费方式授权使用，源码保持私有。**本仓库不采用开源许可证。**源代码及课件设计的其他权利由“张专注物理”保留。具体购买、交付和授权范围确定后，再对外开放使用。详见 [RIGHTS.md](RIGHTS.md)。

打开网页即可旋转和缩放磁铁，切换水平剖面与 3D 空间磁感线，并观察竖直纸面上的 `·` / `×` 方向符号。网页所需代码全部打包进 `index.html`，访问者无需安装软件。

## 本地使用与修改

1. 安装 Node.js 和 Git。
2. 在本项目文件夹运行 `npm ci`，然后运行 `npm run build`。
3. 用浏览器打开 `index.html` 查看课件。
4. 修改 `app.js`（模型与交互）或 `template.html`（界面文字与样式）后，再运行 `npm run build`。

`dist/index.html` 是自动发布用文件。请提交源码和根目录的 `index.html`；`node_modules`、`dist` 和 `app.bundle.js` 不需要提交。

## 修改课件

修改课件后运行 `npm run build`，再提交并推送到 `main`。GitHub Actions 会检查项目能否构建，但当前不会自动公开发布网页。

红端标 N、蓝端标 S 是课堂演示约定；原始实验照片未标明极性。磁感线按等效磁极模型绘制，是帮助理解空间方向的定性图示。
