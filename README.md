# node-wio-link

[![NPM Version](https://img.shields.io/npm/v/node-alexa-smapi.svg)](https://www.npmjs.com/package/node-alexa-smapi)

A node.js client library for using the Wio Link API.

## Table Of Contents

* [Documentation](#documentation)
  * [User Management](#user-management)
  * [Node Management](#node-management)
  * [Grove Driver](#grove-driver)
  * [Boards/Platform](#boardsplatform)
  * [Single Node](#single-node)
  * [Coding on the fly](#coding-on-the-fly)
  * [Custom API calls](#custom-api-calls)
* [Examples](#examples)
  * [Using Promises](#using-promises)
  * [Using Async/Await](#using-asyncawait)

## Documentation
Official Documentation: http://seeed-studio.github.io/Wio_Link/

Built-In Grove APIs: https://github.com/Seeed-Studio/Wio_Link/wiki/Built-in-Grove-APIs

All methods return a promise, which either resolves to the data received, or rejects with an error.

### User Management
```javascript
// Creates a new user account.
wioClient.user.create(String email, String password)

// Changes the password of an existing account.
wioClient.user.changePassword(String userToken, String newPassword)

// Retrieve the password of an existing account.
wioClient.user.retrievePassword(String email)

// Log in to the server with the given credentials.
wioClient.user.login(String email, String password)
```

### Node Management
```javascript
// Creates a new node.
wioClient.nodeManagement.create(String userToken, String name, optional String boardType)

// List the nodes associated with the user.
wioClient.nodeManagement.list(String userToken)

// Rename an existing node.
wioClient.nodeManagement.rename(String userToken, String newName, String nodeSN)

// Delete an existing node.
wioClient.nodeManagement.delete(String userToken, String nodeSN)
```

### Grove Driver
```javascript
// Retrieve all of the grove drivers' information.
wioClient.groveDriver.info(String userToken)

// Retrieve the status of last driver scanning.
wioClient.groveDriver.scanStatus(String userToken)
```

### Boards/Platform
```javascript
// List all of the supported boards.
wioClient.boards.list(String userToken)
```

### Single Node
```javascript
// Lists all of the available resources on a node.
wioClient.node.wellKnown(String nodeToken)

// Read the property of a Grove module.
wioClient.node.read(String nodeToken, String groveInstName, String property, String...args)

// Write to a Grove module.
wioClient.node.write(String nodeToken, String groveInstName, String PropertyOrMethodOrAction, String...args)

// Put the node to sleep.
wioClient.node.sleep(String nodeToken, Number sleepAmount)

// Retrieve the API reference page from the node.
wioClient.node.resources(String nodeToken)

// Trigger the OTA process for the node.
wioClient.node.otaTrigger(String nodeToken, Object data, optional Number buildPhase)

// Track the OTA status of the node.
wioClient.node.otaStatus(String nodeToken)

// Get the configuration of the node.
wioClient.node.config(String nodeToken)

// Change the data exchange server for the node.
wioClient.node.changeDataExchangeServer(String nodeToken, String address, String dataxurl)
```

### Coding on the fly
```javascript
// Upload a user's logic block to a node.
wioClient.cotf.uploadULB(String nodeToken, Object data)

// Download a user's logic block from a node.
wioClient.cotf.downloadULB(String nodeToken)

// Get the value of a variable on the node.
wioClient.cotf.getVariable(String nodeToken, String varName)

// Set the value of a variable on the node.
wioClient.cotf.setVariable(String nodeToken, String varName, String varValue)

// Call a function on the node.
wioClient.cotf.callFunction(String nodeToken, String funcName, String arg)
```

### Custom API calls
In case there's a few APIs that aren't covered in this library, a bunch of custom functions are available to use. They will return the response received from making the call.

```javascript
// Perform a custom HEAD request
wioClient.custom.head(String url)

// Perform a custom GET request
wioClient.custom.get(String url, Object parameters)

// Perform a custom POST request
wioClient.custom.post(String url, Object parameters)

// Perform a custom PUT request
wioClient.custom.put(String url, Object parameters)

// Perform a custom DELETE request
wioClient.custom.delete(String url)
```

## Examples
### Using Promises (arrow functions)
```javascript
// serverLocation can be 'us' or 'cn'
const wioClient = require('node-wio-link')(serverLocation);

wioClient.node.read(nodeToken, 'GroveAirqualityA0', 'quality')
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Using Async/Await
```javascript
// serverLocation can be 'us' or 'cn'
const wioClient = require('node-wio-link')(serverLocation);

(async function() {
  try {
    const airQuality = await wioClient.node.read(nodeToken, 'GroveAirqualityA0', 'quality');
    console.log(airQuality);
  } catch (error) {
    console.log(error);
  }
})();
```
