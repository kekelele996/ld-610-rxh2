# 文物修复档案协作平台

面向博物馆修复团队的文物病害记录、修复方案、影像版本和审批归档平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20110>

后端健康检查：<http://localhost:21110/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Ant Design + Zustand |
| 后端 | NestJS + TypeScript + Prisma |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `relic-restore`
- `FRONTEND_PORT`: 前端端口，默认 `20110`
- `BACKEND_PORT`: 后端端口，默认 `21110`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: relic-restore`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-relic-restore}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- RelicCondition: constants/RelicCondition、types/RelicCondition、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PlanApprovalStatus: constants/PlanApprovalStatus、types/PlanApprovalStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用；其中 ACTIVE_PLAN_APPROVAL_STATUSES（DRAFT/SUBMITTED）用于“同一病害已有方案”拦截。
- DamageSeverity: constants/DamageSeverity、types/DamageSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用；其中 SEVERE_DAMAGE_SEVERITIES（HIGH/CRITICAL）用于严重病害转方案。
- DamageRecordStatus（REGISTERED/CONVERTED/CLOSED）: 后端 constants/DamageRecordStatus、前端 constants/DamageRecordStatus、types/DamageRecordStatus、constructors、病害列表 StatusBadge、转方案服务均有引用。

## 严重病害转修复方案

在「病害记录」页可按严重等级（LOW/MEDIUM/HIGH/CRITICAL）筛选；仅 HIGH/CRITICAL 且未转出方案的病害显示「转修复方案」按钮。
弹窗只需填写方案标题、修复方法（风险评估选填），文物编号由后端按病害记录自动关联，无需转抄。

- 提交成功：生成 `SUBMITTED`（待审批）方案，病害记录置为 `CONVERTED`（已转方案），文物 `current_condition` 置为 `IN_RESTORATION`（修复中），工作台「待审批方案」数量 +1。
- 同一病害已存在 `DRAFT`（草稿）或 `SUBMITTED`（待审批）方案时，后端返回 `409 PLAN_ALREADY_EXISTS`，前端提示已有方案，原病害记录与原方案均不修改。
- 后端把数据落盘到 `DATA_DIR`（默认 `backend/.data`，容器内为命名卷 `backend_data`），进程重启或重新打开页面后上述状态保持不变。
- 接口：`POST /api/damage-record/:id/convert-to-plan`，聚合指标 `GET /api/dashboard/stats`。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
