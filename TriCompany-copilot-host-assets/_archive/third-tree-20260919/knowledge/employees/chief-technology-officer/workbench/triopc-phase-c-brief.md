# TriOPC Phase C 技术交付简要

> 创建时间：2026-07-16 | CTO 小狄 | 委派：小全（编码）+ 小柯（测试）

## 框架与环境

- 框架：ThinkPHP 8 + cores/ 自研基类
- 基类链：`cores\BaseController` → `cores\BaseModel` → ThinkPHP 原生
- 认证：JWT（Firebase\JWT），Auth 中间件注入 `request->userId` / `request->userType` (/ `request->tokenPayload`
- 路由：`route/super.php`（总后台）、`route/admin.php`（商户后台）
- 响应：`renderSuccess($data, $msg)` / `renderError($msg, $data)`
- 校验：BaseController->validate() → ThinkPHP Validate

## 源码现状（Phase C 前）

### 已有
- `app/common/model/AdminUser.php` — 商户用户 Model（opc_admin_user 表，findByUserName/verifyPassword/hashPassword/isActive/toJwtPayload）
- `app/common/model/SuperUser.php` — 总后台管理员 Model（opc_super_user 表，同上模式）
- `app/super/controller/Passport.php` — 总后台登录/刷新/登出
- `app/admin/controller/Passport.php` — 商户后台登录/刷新/登出
- `app/super/service/SuperUserService.php` — 总后台登录逻辑
- `app/middleware/Auth.php` — JWT 认证中间件
- `route/super.php` / `route/admin.php` — 已预留 Phase C 路由注释

### 占位（需创建）
- `app/super/controller/AdminUser.php` — C0：总后台管理商户用户 CRUD
- `app/common/model/Store.php` — C1：商户模型
- `app/super/service/StoreService.php` — C2：审核服务
- `app/super/controller/Store.php` — C3：总后台审核列表+操作
- `app/admin/controller/Store.php` — C4：商户提交+查看状态
- `app/super/service/AuditCallback.php` — C5：回调骨架
- `app/admin/validate/StoreValidate.php` — C6：字段校验

## 任务列表

### C0 — AdminUser CRUD（优先级 1，无依赖）
**文件**：`app/super/controller/AdminUser.php` + 路由注册

接口：
- `GET /super/admin-user/list` — 分页列表（search: userName/realName, status 筛选）
- `GET /super/admin-user/detail?id=` — 详情
- `POST /super/admin-user/create` — 新建（userName/password/realName/storeId/triMemId/agentId）
- `POST /super/admin-user/update` — 编辑
- `POST /super/admin-user/delete` — 软删除（改 status 为 0）

模式参考：Passport.php 的 service 调用 + renderSuccess/renderError
- 不需要独立 service（CRUD 直接在 controller 调用 AdminUser model）
- 需要 password 写入时走 `AdminUser::hashPassword()`
- 全部路由需要 Auth 中间件

### C1 — Store 模型 + 迁移（优先级 2，依赖 C0）
**文件**：`app/common/model/Store.php` + `database/migrations/` 或手动 SQL

Model 字段（opc_store 表）：
- id, admin_user_id, store_name, business_license, legal_person, contact_phone, address, description, status（0待审/1通过/2驳回/3冻结）, audit_remark, created_at, updated_at

继承 BaseModel，模式同 AdminUser.php。

### C2 — StoreService（优先级 3，依赖 C1）
**文件**：`app/super/service/StoreService.php`

方法：
- `list(array $filters): array` — 分页+筛选
- `detail(int $id): array` — 详情
- `audit(int $id, int $status, string $remark): bool` — 审核操作（通过/驳回/冻结）
- `submitCreate(array $data, int $adminUserId): bool` — 商户提交开店申请

### C3 — super/Store 控制器（优先级 4，依赖 C2）
**文件**：`app/super/controller/Store.php` + 路由

接口：
- `GET /super/store/list` — 审核列表（filter: status, search: storeName）
- `GET /super/store/detail?id=` — 详情
- `POST /super/store/audit` — 审核操作（id, status, audit_remark）

全部需要 Auth 中间件（super 类型）。

### C4 — admin/Store 控制器（优先级 4，依赖 C2）
**文件**：`app/admin/controller/Store.php` + 路由

接口：
- `POST /admin/store/submit` — 提交开店申请
- `GET /admin/store/status` — 查看自己的审核状态（按 admin_user_id 隔离）

全部需要 Auth 中间件（admin 类型）。

### C5 — AuditCallback 骨架（优先级 5，依赖 C3）
**文件**：`app/super/service/AuditCallback.php`

定义接口契约：
- `public static function getWebhookUrl(): string` — 返回 Webhook URL（config 读取）
- `public static function buildPayload(int $storeId, int $status, string $remark): array` — 构造回调 payload
- `public function send(array $payload): bool` — 发送回调（当前仅 log + 返回 true，不实际 HTTP 请求）
- 注释标明 TriMem 端点未定义，此处为骨架

### C6 — StoreValidate（优先级 3，依赖 C1）
**文件**：`app/admin/validate/StoreValidate.php`

校验规则：
- store_name: require|max:100
- business_license: require|alphaNum|max:50
- legal_person: require|max:50
- contact_phone: require|regex:/^1[3-9]\d{9}$/
- address: max:255
- description: max:500

### C7 — code-state.md 更新（优先级 6，依赖 C6）
Phase C 完成后更新吸收进度、成熟度评估。

## 编码规范

- 全部文件声明 `declare(strict_types=1);`
- 命名空间：controller → `app\super\controller` / `app\admin\controller`
- Service → `app\super\service` 或 `app\admin\service`
- Model → `app\common\model`
- Validate → `app\admin\validate`
- 返回值一律用 `renderSuccess()` / `renderError()`
- 异常用 `\Exception` throw，controller 用 try-catch 包裹
- 所有管理后台路由注册在 route/super.php，商户路由注册在 route/admin.php
