# 项目简介
基于 PLCS 现有前端架构（Vue3 + Pinia + Vite）做微前端尝试。
vue3-main: 基座
vue3-base: 子应用



### 实验记录-main分支qiankun
1. #subApp 只能放在 App.vue 中，放在 Layout 里面找不到
2. 先找到 #subApp，然后把 DOM 元素替换，但是并没有渲染出来子系统
3. `vite.config.ts` 中关闭热更新，没用
4. 看官方 demo，猜测需要 build 之后，用服务启动
5. build 之后，#app 中没有渲染。子应用访问地址和 httpserver 启动的地址有冲突，会自动加上一段（http://127.0.0.1:8082/localhost:8082），除非换个端口启动，不理解 vite.config.ts 中配置应该怎么写？没有渲染是不是因为配置问题。


### 实验记录-wujie分支
1. <WujieVue></WujieVue>可以放在 app-main 中，怎么和 router-view 结合？
2. 子系统热更新，父系统手动刷新
3. 子系统点击侧栏，父系统URL不会有变化，子系统自己内容跟着变

### log
2023-8-25 初始化项目，尝试qiankun失败，一直没有渲染成功   
2023-8-28 尝试wujie，两个项目启动成功   
2023-8-29 左侧导航切换成功，两个项目可以共享 Navbar ，TODO: UMS顶栏；通过bus通信

### TODO
1. UMS顶栏根据router判断系统，若在UMS中展示。。。若不在，展示子系统。。。
2. UMS点击切换子应用

### 思考
不太适合使用 monorepo ，因为应用都是分开开发的，放在一个大项目里不合适。
资源共享一定要考虑，感觉要用 CDN。
注意梳理应用间的关系。

`附录`
[官方文档](https://qiankun.umijs.org/zh/guide)