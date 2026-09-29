# 条形磁铁 3D 磁场互动课件

**直接使用课件：** https://zhangjinapr.github.io/bar-magnet-3d-lesson/  
**GitHub 源码：** https://github.com/zhangjinapr/bar-magnet-3d-lesson

老师和学生打开网页即可使用，无需登录或付款。可以旋转和缩放条形磁铁，切换水平剖面、3D 空间磁感线与竖直纸面，并观察磁场方向及纸面交点的 `·` / `×` 符号。

## 开源许可

本项目采用 [MIT 许可证](LICENSE)，欢迎免费使用、修改和分享。请在复制或分发时保留版权与许可证声明。

红端标 N、蓝端标 S 是课堂演示约定；原始实验照片未标明极性。磁感线按等效磁极模型绘制，是帮助理解空间方向的定性图示。

## 自愿支持

如果课件对你的教学或学习有帮助，欢迎自愿赞助，支持继续制作开放的物理教学工具。**赞助不是使用课件的条件。** 点击仓库里的 **Sponsor / 赞助** 按钮可前往课件的赞助区，也可用微信扫描下面的收款码。赞助通过微信支付完成，GitHub 仅展示入口。

<img src="assets/wechat-donate.png" alt="张专注物理微信赞助收款码" width="230">

## 联系我

<img src="assets/wechat-contact.png" alt="联系我微信二维码" width="230">

GitHub 账号当前显示名为 **zhangzhuanzhu**，用户名为 **zhangjinapr**。仓库与网页链接以用户名 `zhangjinapr` 为准。

## 本地运行与修改

1. 安装 Node.js 和 Git，克隆本仓库。
2. 在项目目录运行 `npm ci`，再运行 `npm run build`。
3. 用浏览器打开根目录的 `index.html`；修改 `app.js` 或 `template.html` 后重新构建。

`dist/index.html` 是 GitHub Pages 自动发布的单文件课件，代码和二维码已内嵌。向 `main` 推送更新后，GitHub Actions 会重新发布。需要离线压缩包时，在 Windows 上运行 `npm run package:offline`，生成文件位于 `release/`。
