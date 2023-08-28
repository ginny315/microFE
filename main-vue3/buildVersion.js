let fs = require("fs");
const dayjs = require("dayjs");

const getPackageJson = () => {
  let data = fs.readFileSync("./package.json"); //fs读取文件
  return JSON.parse(data); //转换为json对象
};
let packageData = getPackageJson();
const changeBuildVersion = () => {
  let arr = packageData.version.split("."); //切割后的版本号数组
  arr[2] = parseInt(arr[2]) + 1;
  packageData.version = arr.join("."); //转换为以"."分割的字符串
};
const changeBuildTime = () => {
  packageData.lastBuildTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
};
changeBuildVersion();
changeBuildTime();
fs.writeFile(
  "./package.json",
  JSON.stringify(packageData, null, "\t"),
  (err) => {
    if (err) {
      console.log("写入失败", err);
    } else {
      console.log(
        "构建版本:",
        packageData.version,
        " 构建时间:",
        packageData.lastBuildTime,
        "写入成功。"
      );
    }
  }
);
