"use strict";

const axios = require("axios");
const urlJoin = require("url-join");
const semver = require("semver");

function getNpmInfo(npmName, registry) {
  // console.log(npmName)
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios
    .get(npmInfoUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      return Promise.reject(err.response.data);
    });
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://mirrors.cloud.tencent.com/npm";
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  // console.log('npmInfo', npmInfo.versions)
  if (!data) {
    return [];
  }
  return Object.keys(data.versions);
}

function getSemverVersion(baseVersion, versions) {
  versions = versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => {
      // console.log(a, b, semver.gt(a, b))
      return semver.gt(b, a) > 0 ? 1 : -1;
    });
  return versions[0];
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersion = getSemverVersion(baseVersion, versions);
  return newVersion;
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getSemverVersion,
  getDefaultRegistry,
  getNpmSemverVersion,
};
