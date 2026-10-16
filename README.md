# master-maid-playwrigth

Playwright 自动化测试项目。

## 运行测试

### UI Mode（推荐，可视化操作面板）

```
npx playwright test --ui
```

只运行指定文件：

```
npx playwright test tests/createMaid.spec.ts --ui
```

### 命令行模式

```
npx playwright test
```

只运行指定文件（默认会跑 chromium/firefox/webkit 三个浏览器项目，可用 `--project` 限定）：

```
npx playwright test tests/createMaid.spec.ts --project=chromium
```
