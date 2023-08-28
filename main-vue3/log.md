2023-5-8 首页、三个修改页面  
2023-5-11 修改请求逻辑，登录页面样式替换设置  
2023-5-23 用户管理列表  
2023-5-24 个人中心修改优化；菜单管理；用户管理增改；  
2023-5-25 系统管理；个人中心 API 修改；正则优化；系统管理  
2023-5-29 菜单管理 edit，角色管理  
2023-5-30 菜单管理获取 API，表格缩进，type 切换规则  
2023-6-1 菜单全选、全部展开，20 字符限制  
2023-6-2 服务器配置 ；角色编辑；  
2023-6-5 跳转逻辑修改；菜单权限选择 id;  
2023-6-6 角色详情；包含的用户选择；  
2023-6-7 包含的用户组件封装；  
2023-6-9 tree-select 可选择本地 filter 或者远程，添加加载更多  
2023-6-12 修复上级菜单选择 bug，菜单 API 联调完成；  
2023-6-13 配置菜单到实际环境；角色 UI 修改；  
2023-6-14 角色添加所属系统；UMS isStaff 顶栏展示  
2023-6-15 系统管理添加管理员  
2023-6-16 首页根据个人信息展示系统;用户管理列表显示角色;系统管理、角色管理选择可用用户；角色管理选择有权限的子系统；角色详情使用 ID 获取 API；选择对应权限可展示的菜单；  
2023-6-19 修改角色管理按照子系统名称获取菜单  
2023-6-20 角色详情替换菜单 API，菜单权限必选限制 bug  
2023-6-21 菜单-上级菜单必选  
2023-7-3 修复角色为 null；添加系统管理员;  
2023-7-4 el-switch 文字；添加 select clearable;  
2023-7-6 解决 transition bug  
2023-7-13 新增菜单图标  
2023-7-15 修改首页样式；cookie 存储 name,displayName  
2023-7-18 首页改版；角色所属系统新增；样式新增  
2023-7-31 上移、下移菜单；api 文件添加后端菜单；部分交互优化  
2023-8-1 路由配置页面、操作日志页面;上移显示 bug；  
2023-8-2 搜索样式修改；菜单管理级联多选不能使用自定义节点，1.换行会重叠，改原始样式麻烦 2.一级二级可能为空，无法判断叶子结点;操作时间限制到 180 天之前  
2023-8-3 功能模块下拉选择,编辑数据回显;路由配置增删改查 API,配置后在菜单管理选择  
2023-8-4 样式修改，操作日志查询样式.  
2023-8-7 操作日志创建人为选择，选择用户组件修改优化；  
2023-8-9 操作日志点击加载更多；搜索-子系统、操作人、时间、操作结果，  
2023-8-10 btn-loading 用户管理新增已加  
2023-8-14 用户管理搜索修改、分配角色  
2023-8-15 分配角色弹窗优化、新建用户弹窗优化、所有按钮折叠；首次登录修改密码  
2023-8-17 step 组件；网页邮件  
2023-8-18 step 按照 UI 实现，忘记密码逻辑完善；  
2023-8-21 发送验证码、验证验证码、重置密码 API;首次登录修改密码 API；

v0.1.0.5 v8.0 终版  
v0.1.0.6 排序、后端菜单管理  
v0.1.0.7 用户管理分配角色、忘记密码、首次登录修改密码

TODO：

1. 分配角色-按照系统获取角色级联选择
1. 新增用户+角色选择结果 API 验证
1. 顶栏最小宽度
1. 动态菜单(dynamic 分支)

`附录`  
[element-ui table expand 展开树形菜单手风琴效果](https://blog.csdn.net/momoomom/article/details/108016148) [el-tree 全选、清空、展开、收缩等基本功能总结](https://blog.csdn.net/maidu_xbd/article/details/104475257)

http://10.10.34.31:7000/images/form-title.png  
http://10.10.34.31:7000/images/login-left.png  
http://10.10.34.31:7000/images/login-bg.png

form-css

<style>
.login-form {
	padding-top: 64px;
}
  .login-panel{
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 0 20px 12px #467eff1f;
}
.ant-layout-footer {
	display: none;
}
input:-webkit-autofill {
  transition: background-color 5000s ease-in-out !important;
}
:where(.css-10ed4xt).ant-btn-primary {
  background-color: #3378FF !important;
}

:where(.css-10ed4xt) a {
  color: #3378FF !important;
}
:where(.css-10ed4xt).ant-checkbox-checked .ant-checkbox-inner {
  background-color: #3378FF;
  border-color: #3378FF;
}
</style>

侧面版 style

<style>
  .left-model{
    text-align: center;
    position: absolute;
    transform: none;
    width: 100%;
    height: 100%;
  }
  .left-model img{
    width: 100%
  }
  .side-image {
    border: 0 !important;
  }

</style>
<div class="left-model">
  <img src="http://10.10.34.31:7000/images/login-left.png" alt="left-logo"/>
</div>

#3378FF
