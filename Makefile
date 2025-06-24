# GHS Color Next - Makefile
# 基于Docker Hub的一键部署命令

.PHONY: help deploy stop clean logs status pull

# 默认目标
.DEFAULT_GOAL := help

# 颜色定义
BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m

# 配置
IMAGE_NAME := mysticstars/ghs-color:latest
CONTAINER_NAME := ghs-color

help: ## 显示帮助信息
	@echo "$(BLUE)GHS Color Next - 一键部署命令$(NC)"
	@echo ""
	@echo "$(GREEN)可用命令:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-12s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)示例:$(NC)"
	@echo "  make deploy   # 一键部署应用"
	@echo "  make stop     # 停止服务"
	@echo "  make logs     # 查看日志"

pull: ## 拉取最新镜像
	@echo "$(BLUE)拉取最新镜像...$(NC)"
	docker pull $(IMAGE_NAME)
	@echo "$(GREEN)✅ 镜像拉取成功$(NC)"

deploy: pull ## 一键部署应用
	@echo "$(BLUE)停止现有容器...$(NC)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(BLUE)启动新容器...$(NC)"
	@if [ ! -z "$$NEXT_PUBLIC_COLORS" ]; then \
		echo "$(YELLOW)使用自定义颜色配置$(NC)"; \
	fi
	@if [ ! -z "$$NEXT_PUBLIC_CATEGORIES" ]; then \
		echo "$(YELLOW)使用自定义分类配置$(NC)"; \
	fi
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p 3000:3000 \
		--restart unless-stopped \
		-e NODE_ENV=production \
		-e NEXT_PUBLIC_APP_NAME="GHS Color Next" \
		-e NEXT_PUBLIC_APP_VERSION="2.0.0" \
		-e NEXT_PUBLIC_GITHUB_URL="https://github.com/Mystic-Stars/GHS-Color" \
		$$(if [ ! -z "$$NEXT_PUBLIC_COLORS" ]; then echo "-e NEXT_PUBLIC_COLORS=$$NEXT_PUBLIC_COLORS"; fi) \
		$$(if [ ! -z "$$NEXT_PUBLIC_CATEGORIES" ]; then echo "-e NEXT_PUBLIC_CATEGORIES=$$NEXT_PUBLIC_CATEGORIES"; fi) \
		$(IMAGE_NAME)
	@echo "$(GREEN)✅ 部署成功！$(NC)"
	@echo "$(GREEN)🌐 访问地址: http://localhost:3000$(NC)"

stop: ## 停止服务
	@echo "$(BLUE)停止服务...$(NC)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(GREEN)✅ 服务已停止$(NC)"

clean: stop ## 清理所有资源
	@echo "$(BLUE)清理Docker资源...$(NC)"
	@docker rmi $(IMAGE_NAME) 2>/dev/null || true
	@echo "$(GREEN)✅ 清理完成$(NC)"

logs: ## 查看日志
	docker logs -f $(CONTAINER_NAME)

status: ## 查看服务状态
	@echo "$(BLUE)服务状态:$(NC)"
	@docker ps --filter name=$(CONTAINER_NAME) --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

restart: stop deploy ## 重启服务

# 环境检查
check: ## 检查Docker环境
	@echo "$(BLUE)检查Docker环境...$(NC)"
	@docker --version || (echo "$(RED)❌ Docker 未安装$(NC)" && exit 1)
	@echo "$(GREEN)✅ Docker 环境正常$(NC)"

# 使用Docker Compose部署
compose: ## 使用Docker Compose部署
	@echo "$(BLUE)使用Docker Compose部署...$(NC)"
	docker-compose -f docker-compose.simple.yml up -d
	@echo "$(GREEN)✅ 部署成功！$(NC)"
	@echo "$(GREEN)🌐 访问地址: http://localhost:3000$(NC)"

compose-stop: ## 停止Docker Compose服务
	docker-compose -f docker-compose.simple.yml down
