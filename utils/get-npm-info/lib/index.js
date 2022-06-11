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
	return axios.get(npmInfoUrl).then(response => {
		console.log('response.status', response.status)
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
	return isOriginal ? 'https://registry.npmjs.org' : 'https://mirrors.cloud.tencent.com/npm'
}

async function getNpmVersions(npmName, registry) {
	const npmInfo = await getNpmInfo(npmName, registry)
	console.log('npmInfo', npmInfo.versions)
	return npmInfo && Object.keys(npmInfo.versions)
}

async function getSemverVersions(baseVersion, versions) {
	versions = versions.filter(version => semver.satisfies(version, `^${baseVersion}`))
		.sort((a, b) => semver.gt(a, b))
	return versions
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
	const versions = await getNpmVersions(npmName, registry)
	const newVersions = getSemverVersions(baseVersion, versions)
	return newVersions[0]
}

module.exports = {
	getNpmInfo,
	getNpmVersions,
	getSemverVersions,
	getNpmSemverVersion
}