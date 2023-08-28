# 安装和使用

- 获取代码

```bash
git clone http://10.10.30.149:1080/gny315/cardlc.git
```

- 安装依赖

```bash
cd cardlc
npm i

```

- 运行

```bash
npm run dev
```

- 打包  
  server 开发环境 31，test 测试环境 32，API 有出入  
  prod 生产环境，去除所有 console

```bash
npm run build:dev
npm run build:server
npm run build:test
npm run build:prod
```
