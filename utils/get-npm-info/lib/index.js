'use strict';
const axios =require("axios");
const urlJoin=require('url-join');
const semver=require('semver');



function getNpmInfo(npmName,registry) {
    console.log(npmName);
    if(!npmName){
        return null
    }
    const registryUrl=registry||getDefaultRegistry();
    const npmInfoUrl=urlJoin(registryUrl,npmName);
    return axios.get(npmInfoUrl).then(res=>{
        if(res.status===200){
            return res.data;
        }else{
            return null;
        }
    }).catch(err=>{
        return Promise.reject(err)
    })
}

function getDefaultRegistry(isOriginal=false){
    return isOriginal?"https://registry.npmjs.org/":"https://registry.npm.taobao.org/"
}


module.exports = {
    getNpmInfo
}