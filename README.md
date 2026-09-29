# 条形磁铁 3D 磁场互动课件

打开网页即可旋转和缩放磁铁，切换水平剖面与 3D 空间磁感线，并观察竖直纸面上的 `·` / `×` 方向符号。网页所需代码全部打包进 `index.html`，访问者无需安装软件。

## 本地使用与修改

1. 安装 Node.js 和 Git。
2. 在本项目文件夹运行 `npm ci`，然后运行 `npm run build`。
3. 用浏览器打开 `index.html` 查看课件。
4. 修改 `app.js`（模型与交互）或 `template.html`（界面文字与样式）后，再运行 `npm run build`。

`dist/index.html` 是自动发布用文件。请提交源码和根目录的 `index.html`；`node_modules`、`dist` 和 `app.bundle.js` 不需要提交。

## 发布到 GitHub Pages

1. 在 GitHub 上创建**公开**空仓库，建议名称 `bar-magnet-3d-lesson`。不要勾选自动添加 README、`.gitignore` 或许可证。
2. 把本地 `main` 分支推送到该仓库。
3. 打开仓库的 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
4. 打开 **Actions**，等待 `Deploy GitHub Pages` 成功。网页地址通常是 `https://你的用户名.github.io/bar-magnet-3d-lesson/`。

以后修改课件，只需运行 `npm run build`，提交并推送到 `main`。工作流会自动重新发布。发布给学生或放入视频简介时，请使用 Pages 网页地址，而不是 GitHub 仓库地址。

红端标 N、蓝端标 S 是课堂演示约定；原始实验照片未标明极性。磁感线按等效磁极模型绘制，是帮助理解空间方向的定性图示。
