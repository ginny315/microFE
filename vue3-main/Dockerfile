# 基础镜像
FROM registry.tecorigin.io:5443/plcs/plcs-nginx:base
# 维护者信息
LABEL maintainer="<wangcunxiang@tecorigin.com>"
# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai
# 使用软连接，并且将时区配置覆盖/etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TimeZone /etc/localtime && echo $TimeZone > /etc/timezone
# 设置工作目录
WORKDIR /usr/share/nginx/html
# 暴露端口
EXPOSE 80
# 复制文件到指定目录
COPY dist/  /usr/share/nginx/html
# 运行命令
CMD ["nginx", "-g", "daemon off;"]
