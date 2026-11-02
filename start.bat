@echo off
chcp 65001 >nul
title Clean Web PDF Reader
echo ========================================================
echo       Clean Web PDF Reader - 极简网页版 PDF 阅读器
echo ========================================================
echo.
echo 正在启动浏览器打开阅读器...
start "" "%~dp0index.html"
echo.
echo 提示：
echo - 本应用为 100% 纯客户端本地渲染，无需上传任何服务器，安全私密。
echo - 支持直接拖拽任意本地 PDF 文件至窗口中阅读。
echo - 快捷键：J/K 翻页、[ 侧边栏、D 切换护眼主题、F 禅模式全屏、Ctrl+F 搜索。
echo.
timeout /t 3 >nul
exit
