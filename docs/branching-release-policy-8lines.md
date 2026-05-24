# 分支与发布规范（8行口令版�?

1. 开发只�?`dev`：`git checkout dev; git pull --ff-only origin dev`
2. 发布不从 `dev` 直接出包，必须先�?`release/*`
3. Tride 发布线：`git checkout -B release/<date-sha> <commit>; git push -u origin release/<date-sha>`
4. vscodium 发布线：`git fetch --tags upstream --prune; git checkout -B release/<tag> refs/tags/<tag>; git push -u origin release/<tag>`
5. 发布窗口内，`release/*` 只收必要修复，不收新功能
6. 紧急修复走 `hotfix/*`：从生产基线切出，修完发�?
7. 回灌必须双向完成：`hotfix/* -> release/*` �?`hotfix/* -> dev`
8. 发布后回灌：`release/* -> dev`，禁止只修发布线不回�?

