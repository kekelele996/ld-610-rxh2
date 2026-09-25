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
- PlanApprovalStatus: constants/PlanApprovalStatus、types/PlanApprovalStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DamageSeverity: constants/DamageSeverity、types/DamageSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DamageRecordStatus（OPEN 待处理 / CONVERTED 已转方案 / CLOSED 已关闭）：前端 `constants/DamageRecordStatus.ts`、`types/DamageRecordStatus.ts`、`constants/statusText.ts`、`constructors/DamageRecordConstructor.ts`、`mocks/seedData.ts`、病害页列表/转方案流程；后端 `constants/DamageRecordStatus.ts`、`constructors/DamageRecordDtoFactory.ts`、`services/DamageRecordService.ts`、`seed.ts`。

## 严重病害转修复方案流程

1. 病害记录页（`/damages`）顶部可按病害等级（低 / 中 / 高 / 严重）筛选列表。
2. 仅高（HIGH）/ 严重（CRITICAL）病害显示“转方案”按钮，弹窗只需填写**方案标题**和**修复方法**，文物编号由后端按病害记录自动带入。
3. 提交接口：`POST /api/damage-record/:id/convert-to-plan`。后端在 `DamageRecordService.convertToPlan` 中一次性完成：
   - 同一病害已存在草稿（DRAFT）或待审批（SUBMITTED）方案时返回 `409 PLAN_ALREADY_EXISTS`，**原病害记录与原方案均不改动**；
   - 非严重病害返回 `400 DAMAGE_NOT_SEVERE`，标题/修复方法缺失返回 `400 VALIDATION_FAILED`；
   - 成功后创建待审批（SUBMITTED）方案、把病害状态置为 CONVERTED（已转方案）、把文物 `current_condition` 置为 IN_RESTORATION（修复中），并写入 `logTemplates` 中对应的方案创建 / 病害状态变更 / 文物状态变更日志。
4. 工作台（`/dashboard`）每次进入重新拉取数据，待审批方案数量随之增加；后端在运行期间持有数据，重新打开（刷新）页面后状态保持不变。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
