'use strict';

const axios = require('axios');

function WioLinkClient(serverLocation) {
  const clientLib = {};

  if (!serverLocation)
    serverLocation = 'us';
  else {
    serverLocation = serverLocation.toLowerCase();
    if (!['cn', 'us'].includes(serverLocation))
      throw new Error(`Invalid server location: "${serverLocation}"`);
  }

  function configureHeaders(token, usingUrlEncoded) {
    const headers = {};
    if (token)
      headers['Authorization'] = 'token ' + token;
    headers['Content-Type'] = 'application/' + (usingUrlEncoded ? 'x-www-form-urlencoded' : 'json');
    return headers;
  }

  const rest = {
    client: axios.create({
      baseURL: `https://${serverLocation}.wio.seeed.io/v1/`,
      headers: {
        'Accept': 'application/json'
      }
    }),
    get: function(token, url, usingUrlEncoded) {
      return this.client.get(url, { headers: configureHeaders(token, usingUrlEncoded) })
        .then(response => response.data)
        .catch(response => Promise.reject(response.response.data));
    },
    post: function(token, url, data, usingUrlEncoded) {
      return this.client.post(url, data !== undefined ? data : {}, { headers: configureHeaders(token, usingUrlEncoded) })
        .then(response => response.data)
        .catch(response => Promise.reject(response.response.data));
    }
  };

  clientLib.user = {
    create: (email, password) => rest.post(null, 'user/create', { email, password }),
    changePassword: (userToken, newPassword) => rest.post(userToken, 'user/changepassword', { password: newPassword }),
    retrievePassword: (email) => rest.post(null, 'user/retrievepassword', { email }),
    login: (email, password) => rest.post(null, 'user/login', { email, password })
  };

  clientLib.nodeManagement = {
    create: (userToken, name, boardType) => rest.post(userToken, 'nodes/create', { name, board: boardType }),
    list: (userToken) => rest.get(userToken, 'nodes/list'),
    rename: (userToken, newName, nodeSN) => rest.post(userToken, 'nodes/rename', { name: newName, node_sn: nodeSN }),
    delete: (userToken, nodeSN) => rest.post(userToken, 'nodes/delete', { node_sn: nodeSN })
  };

  clientLib.groveDriver = {
    info: (userToken) => rest.get(userToken, 'scan/drivers'),
    scanStatus: (userToken) => rest.get(userToken, 'scan/status')
  };

  clientLib.boards = {
    list: (userToken) => rest.get(userToken, 'boards/list')
  };

  clientLib.node = {
    wellKnown: (nodeToken) => rest.get(nodeToken, 'node/.well-known'),
    read: (nodeToken, groveInstName, property, ...args) => rest.get(nodeToken, `node/${groveInstName}/${property}/${args.join('/')}`, true),
    write: (nodeToken, groveInstName, PMA, ...args) => rest.post(nodeToken, `node/${groveInstName}/${PMA}/${args.join('/')}`, undefined, true),
    sleep: (nodeToken, sleepAmount) => rest.post(nodeToken, `node/pm/sleep/${sleepAmount}`),
    resources: (nodeToken) => rest.get(nodeToken, 'node/resources'),
    otaTrigger: (nodeToken, data, buildPhase) => rest.post(nodeToken, 'ota/trigger' + (buildPhase ? '?build_phase=' + buildPhase : ''), data),
    otaStatus: (nodeToken) => rest.get(nodeToken, 'ota/status'),
    config: (nodeToken) => rest.get(nodeToken, 'node/config'),
    changeDataExchangeServer: (nodeToken, address, dataxurl) => rest.post(nodeToken, `node/setting/dataxserver/${address}`, { dataxurl })
  };

  clientLib.cotf = {
    uploadULB: (nodeToken, data) => rest.post(nodeToken, 'cotf/project', data),
    downloadULB: (nodeToken) => rest.get(nodeToken, 'cotf/project'),
    getVariable: (nodeToken, varName) => rest.get(nodeToken, `node/variable/${varName}`),
    setVariable: (nodeToken, varName, varValue) => rest.post(nodeToken, `node/variable/${varName}/${varValue}`),
    callFunction: (nodeToken, funcName, arg) => rest.post(nodeToken, `node/function/${funcName}`, { arg })
  };

  clientLib.custom = {
    head: url => rest.head(url),
    get: (url, parameters) => rest.get(url, parameters),
    post: (url, parameters) => rest.post(url, parameters),
    put: (url, parameters) => rest.put(url, parameters),
    delete: url => rest.delete(url)
  };

  return clientLib;
}

module.exports = WioLinkClient;