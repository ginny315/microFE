window.APP_CONFIG = {
    dev: {
        casdoor: {
            serverUrl: "http://10.10.34.31:8001",
            clientId: "5f33f1b3c70cce9e3623",
            organizationName: "built-in",
            appName: "UMS",
            redirectPath: "/cb"
        },
        backend: "http://10.10.30.2:9080/ums",
    },
    server: {
        casdoor: {
            serverUrl: "http://10.10.34.31:8001",
            clientId: "5f33f1b3c70cce9e3623",
            organizationName: "built-in",
            appName: "UMS",
            redirectPath: "/ums/cb"
        },
        backend: "http://10.10.30.2:9080/ums",
    },
    test: {
        casdoor: {
            serverUrl: "http://10.10.34.32:8001",
            clientId: "0e5f83e86e7ca5f38b33",
            organizationName: "built-in",
            appName: "UMS",
            redirectPath: "/ums/cb"
        },
        backend: "http://10.10.34.32:9080/ums",
    },
    production: {
        casdoor: {
            serverUrl: "http://10.10.34.34:8001",
            clientId: "748d3e45d8f301dda5b9",
            organizationName: "built-in",
            appName: "UMS",
            redirectPath: "/ums/cb"
        },
        backend: "http://10.10.34.34:9080/ums",
    }
}