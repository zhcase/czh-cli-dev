'use strict'
const axios = require("axios")
const urlJoin = require('url-join')
const semver = require('semver')


// 获取Npm版本信息
function getNpmInfo(npmName, registry) {
    console.log(npmName)
    if (!npmName) {
        return null
    }
    const registryUrl = registry || getDefaultRegistry()
    const npmInfoUrl = urlJoin(registryUrl, npmName)
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            return null
        }
    }).catch(err => {
        return Promise.reject(err)
    })
}


// 使用是否淘宝镜像
function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? "https://registry.npmjs.org/" : "https://registry.npm.taobao.org/"
}

// 获取多个版本号
async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry)
    if (data) {
        return Object.keys(data.versions)
    } else {
        return []
    }
}

// 过滤版本号
async function getSemverVersions(baseVersion, versions) {
    versions = versions.filter(version =>
        semver.satisfies(version, `^${baseVersion}`)
    ).sort((a, b) => {
        return semver.gt(b, a)
    })
    return versions
}


async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry)
    const newVersions = await getSemverVersions(baseVersion, versions)
    if (newVersions && newVersions.length > 0) {
        return newVersions[0]
    }
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion
}