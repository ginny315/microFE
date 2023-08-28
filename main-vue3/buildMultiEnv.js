let fs = require("fs");

const filePath = './dist/api.js'
const changeBuildUrl = () => {
  fs.readFile(filePath, function(err, data) {
    if(err) {
      console.log(err)
      return
    } 
    let str = data.toString()
    const tag = str.split('tag: "')[1].split('"')[0]
    let content = ''
    if(tag == '1') { // 开发环境
      content = 'window.g={apiUrl:"http://10.10.30.2:9080",tag: "2",casdoor:{serverUrl: "http://10.10.34.31:8001",clientId: "5f33f1b3c70cce9e3623",organizationName: "built-in",appName: "UMS",redirectPath: "/ums/cb"},backend: "http://10.10.30.2:9080/ums"}'
    } else if(tag == '2') { // 测试环境
      content = 'window.g={apiUrl:"http://10.10.34.32:9080",tag: "1",casdoor:{serverUrl: "http://10.10.34.32:8001",clientId: "0e5f83e86e7ca5f38b33",organizationName: "built-in",appName: "UMS",redirectPath: "/ums/cb"},backend: "http://10.10.34.32:9080/ums"}'
    } else {}
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.log("写入失败", err);
      } else {
        console.log("写入成功。");
      }
    })
  })
};
changeBuildUrl();
