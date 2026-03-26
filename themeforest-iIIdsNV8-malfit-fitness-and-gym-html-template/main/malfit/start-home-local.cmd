@echo off
setlocal
cd /d "%~dp0"
echo Starting Lifestyle Reset local server on http://127.0.0.1:4173/home.html
echo Keep this window open while using the site.
echo.
"C:\Program Files\nodejs\node.exe" serve-dist.js
echo.
echo The server stopped or failed to start.
pause
