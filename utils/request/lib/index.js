'use strict';


const axios =require("axios");

const BASE_URL=process.env.CZH_CLI_BASE_URL?process.env.CZH_CLI_BASE_URL:"";

const request=axios.create({
    baseURL:BASE_URL,
    timeout:5000
})

module.exports = request;