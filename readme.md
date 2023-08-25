# 项目简介
基于 PLCS 现有前端架构（Vue3 + Pinia + Vite）做微前端尝试。
vue3-main: 基座
vue3-base: 子应用



实验记录
1. #subApp 只能放在 App.vue中，放在 Layout 里面找不到
2. 先找到 #subApp，然后把 DOM 元素替换，但是并没有渲染出来子系统
3. `vite.config.ts` 中关闭热更新，没用
4. 看官方 demo，猜测需要 build 之后，用服务启动。



`附录`
[官方文档](https://qiankun.umijs.org/zh/guide)