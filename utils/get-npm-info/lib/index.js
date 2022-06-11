'use strict';

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
	console.log(npmName)
	if (!npmName) {
		return null
	}
	const registryUrl = registry || getDefaultRegistry()
	const npmInfoUrl = urlJoin(registryUrl, npmName)
	console.log(npmInfoUrl);
	return axios.get(npmInfoUrl).then(response => {
		console.log(response)
		if (response.status === 200) {
			return response.data
		} else {
			return null
		}
	}).catch(err => {
		return Promise.reject(err.response.data)
	})
}

function getDefaultRegistry(isOriginal = false) {
	return isOriginal ? 'https//registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

async function getNpmVersions(npmName, registry) {
	const npmInfo = await getNpmInfo(npmName, registry)
	return npmInfo && npmInfo.versions
}

module.exports = {
	getNpmInfo
}