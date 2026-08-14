# RM Recruit

面向 RoboMaster 战队的简历投递与审核系统。公开端提供组别介绍、投递指南和 PDF 简历提交；管理端提供账号登录、按角色隔离的方形候选人视图、PDF 在线预览及审核记录。

## 功能与权限

- 申请人无需登录，可选择最多 2 个组别并提交一份必需的 PDF 简历（最大 10 MB）。
- 组长管理员只能查看本人负责组，以及主/次意向中包含“不确定”的简历。
- 队长管理员可以查看全部简历、创建或删除组长账号。
- 管理员权限在服务端 API 和 PDF 下载接口中再次校验，不能通过修改前端筛选绕过。
- 数据使用 SQLite 保存，PDF 保存到独立目录，二者都位于 Docker 的 `/data` 持久卷。

## Docker 部署

要求 Docker Engine 与 Docker Compose 插件。

1. 复制环境变量模板：

   ```bash
   cp .env.example .env
   ```

2. 修改 `.env`，至少设置一个长度不小于 10 位的强密码：

   ```dotenv
   CAPTAIN_USERNAME=captain
   CAPTAIN_PASSWORD=your-long-random-password
   CAPTAIN_DISPLAY_NAME=队长
   APP_PORT=3000
   COOKIE_SECURE=false
   ```

3. 构建并启动：

   ```bash
   docker compose up -d --build
   ```

4. 打开：

   Compose 默认只在服务器回环地址监听应用端口，请通过同机反向代理访问：

   - 队员投递端：`https://你的域名/apply`
   - 管理员登录：`https://你的域名/admin/login`

队长账号只会在数据库中尚无管理员时从环境变量初始化。持久卷建立后，修改 `.env` 不会重置现有密码或覆盖账号。

## 数据与备份

Compose 默认创建 `rm-recruit-data` 命名卷，其中包含：

```text
/data/
├── rm-recruit.sqlite
├── rm-recruit.sqlite-wal
├── rm-recruit.sqlite-shm
└── resumes/
    └── <application-id>.pdf
```

备份时应同时保留 SQLite 文件和 `resumes/`。为了得到一致快照，最简单的方式是在低峰期先停止容器，再备份整个卷：

```bash
docker compose stop
docker run --rm -v rm_rm-recruit-data:/source:ro -v "$PWD":/backup alpine \
  tar -czf /backup/rm-recruit-backup.tar.gz -C /source .
docker compose start
```

卷名会随 Compose 项目名变化，可先运行 `docker volume ls` 确认实际名称。

## 反向代理与生产建议

- 在 Nginx、Caddy 或 Traefik 后提供 HTTPS，并将 `COOKIE_SECURE=true`；若直接通过 HTTP 端口访问，则保持 `false`，否则浏览器不会保存登录 Cookie。
- 将 `/data` 放在可靠磁盘并制定定期、异机备份策略。
- 不要提交 `.env`，生产环境优先通过服务器密钥管理机制注入密码。
- 如使用宿主机目录绑定到 `/data`，确保容器内 UID/GID `1001:1001` 对该目录有读写权限。
- 如果部署多个应用副本，SQLite 与本地 PDF 目录不适合作为共享存储；届时应迁移到 PostgreSQL 和对象存储。当前 Compose 配置面向单机单副本。

## 本地开发

```bash
npm install
CAPTAIN_USERNAME=captain \
CAPTAIN_PASSWORD=development-password \
DATA_DIR=./data \
npm run dev
```

常用检查：

```bash
npm test
npm run lint
npm run build
docker compose config
```

## 路由

| 路由 | 用途 | 权限 |
| --- | --- | --- |
| `/apply` | 简历投递 | 公开 |
| `/groups` | 组别介绍 | 公开 |
| `/guide` | 投递指南 | 公开 |
| `/admin/login` | 管理员登录 | 公开 |
| `/admin` | 审核工作台 | 管理员 |
| `/api/admin/applications/:id/resume` | PDF 在线预览 | 按管理员角色校验 |
| `/api/health` | 容器健康检查 | 公开 |
