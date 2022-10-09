const request=require("@czh-cli-dev/request");


module.exports=function (params) {
        return request({
            url:"/project/template"
        })
}