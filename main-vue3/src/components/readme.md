1. Select/user  
   选择单用户组件中已经获取了系统活跃用户列表（只需要请求一次获取用户），可以选择列表中单个用户

```javascript
import user from '@/components/Select/user.vue'
;<user text="请选择操作人"></user>
```

2. Select/userMulti  
   需要向组件中传递用户列表和用户总数（只需要请求一次获取用户）组件中默认为本地搜索远程搜索已有入口，可按照需求选择 mode=2

```javascript
import userMulti from '@/components/Select/userMulti.vue'
<user-multi
  v-model="sysForm.administrators"
  text="请选择管理员"
  :optionAll="userListAll"
  :optionTotal="userTotal"
></user-multi>
```

3. Code/captcha  
   后端获取二进制流图片显示验证码，暴露刷新 `refreshCode` 方法

```javascript
import captcha from '@/components/Code/captcha.vue'
;<captcha ref="captchaRef"></captcha>
onMounted(() => {
  loadVerifyCode()
})

const loadVerifyCode = () => {
  captchaRef.value.refreshCode()
  state.userForm.captcha = ''
}
```

4. Code/securityCode  
   手机输入获取的验证码

```javascript
import securityCode from '@/components/Code/securityCode.vue'
;<security-code v-model="userForm.code"></security-code>
```

5. Code/captchaFe  
   前端生成验证码

```javascript
import captchaFe from '@/components/Code/captchaFe.vue'
;<captcha-fe></captcha-fe>
```
