@echo off
REM GHS Color Next - 一键部署脚本 (Windows)
REM 直接从Docker Hub拉取预构建镜像，实现真正的一键部署

setlocal enabledelayedexpansion

REM 设置编码为UTF-8
chcp 65001 >nul

REM 配置
set IMAGE_NAME=mysticstars/ghs-color
set CONTAINER_NAME=ghs-color
set DEFAULT_PORT=3000

echo ╔══════════════════════════════════════╗
echo ║  GHS Color Next - 一键部署           ║
echo ║  现代化色彩管理工具                  ║
echo ╚══════════════════════════════════════╝
echo.

REM 检查Docker是否安装
echo [INFO] 检查Docker环境...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker 未安装！
    echo.
    echo 请先安装Docker Desktop:
    echo https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker 服务未启动！
    echo.
    echo 请启动 Docker Desktop
    pause
    exit /b 1
)

echo [SUCCESS] Docker 环境检查通过

REM 停止并删除现有容器
docker ps -a --format "table {{.Names}}" | findstr /r "^%CONTAINER_NAME%$" >nul 2>&1
if not errorlevel 1 (
    echo [INFO] 发现现有容器，正在清理...
    docker stop %CONTAINER_NAME% >nul 2>&1
    docker rm %CONTAINER_NAME% >nul 2>&1
    echo [SUCCESS] 现有容器已清理
)

REM 拉取最新镜像
echo [INFO] 正在拉取最新镜像...
echo 镜像: %IMAGE_NAME%:latest
docker pull %IMAGE_NAME%:latest
if errorlevel 1 (
    echo [ERROR] 镜像拉取失败
    echo.
    echo 可能的原因：
    echo 1. 网络连接问题
    echo 2. Docker Hub 访问受限
    echo 3. 镜像不存在
    pause
    exit /b 1
)
echo [SUCCESS] 镜像拉取成功

REM 获取端口配置
echo.
echo 端口配置
echo 默认端口: %DEFAULT_PORT%
set /p user_port="请输入要使用的端口 (直接回车使用默认端口): "

if "%user_port%"=="" (
    set PORT=%DEFAULT_PORT%
) else (
    set PORT=%user_port%
)

REM 检查端口是否被占用
netstat -an | findstr ":%PORT% " >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] 端口 %PORT% 已被占用
    set /p continue_port="是否继续使用此端口? (y/N): "
    if /i not "!continue_port!"=="y" (
        echo 部署已取消
        pause
        exit /b 1
    )
)

REM 启动容器
echo [INFO] 正在启动容器...

REM 检查是否有自定义颜色配置
set EXTRA_ENV=
if defined NEXT_PUBLIC_COLORS (
    set EXTRA_ENV=%EXTRA_ENV% -e NEXT_PUBLIC_COLORS="%NEXT_PUBLIC_COLORS%"
    echo [INFO] 使用自定义颜色配置
)
if defined NEXT_PUBLIC_CATEGORIES (
    set EXTRA_ENV=%EXTRA_ENV% -e NEXT_PUBLIC_CATEGORIES="%NEXT_PUBLIC_CATEGORIES%"
    echo [INFO] 使用自定义分类配置
)

docker run -d ^
    --name %CONTAINER_NAME% ^
    -p %PORT%:3000 ^
    --restart unless-stopped ^
    -e NODE_ENV=production ^
    -e NEXT_PUBLIC_APP_NAME="GHS Color Next" ^
    -e NEXT_PUBLIC_APP_VERSION="2.0.0" ^
    -e NEXT_PUBLIC_GITHUB_URL="https://github.com/Mystic-Stars/GHS-Color" ^
    %EXTRA_ENV% ^
    %IMAGE_NAME%:latest

if errorlevel 1 (
    echo [ERROR] 容器启动失败
    pause
    exit /b 1
)
echo [SUCCESS] 容器启动成功

REM 等待服务启动
echo [INFO] 等待服务启动...
timeout /t 10 /nobreak >nul

REM 显示部署结果
echo.
echo 🎉 部署完成！
echo.
echo 访问信息:
echo   🌐 应用地址: http://localhost:%PORT%
echo   📦 容器名称: %CONTAINER_NAME%
echo   🏷️  镜像版本: %IMAGE_NAME%:latest
echo.
echo 管理命令:
echo   查看日志: docker logs %CONTAINER_NAME%
echo   停止服务: docker stop %CONTAINER_NAME%
echo   启动服务: docker start %CONTAINER_NAME%
echo   删除容器: docker rm -f %CONTAINER_NAME%
echo.
echo 感谢使用 GHS Color Next！
echo.

REM 询问是否打开浏览器
set /p open_browser="是否现在打开浏览器访问应用? (Y/n): "
if /i not "!open_browser!"=="n" (
    start http://localhost:%PORT%
)

pause
