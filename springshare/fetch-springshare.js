const axios = require("axios");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

let fetchSpringshare = function(token, params, urlFront, callback) {
  const headers = {
    Authorization: "Bearer " + token,
    Accept: "application/json"
  };

  if (myCache.get(`${params}_token_key`) == undefined) {
    axios
      .get(`${urlFront}${params}`, {
        headers
      })
      .then(response => {
        callback(null, response.data);
        return response.data;
      })
      .then(function(response) {
        myCache.set(`${params}_token_key`, response, 240, function(err, success) {
          if (!err && success) {
            console.log("setting the cache of the response", success);
          }
        });
      })
      .catch(error => {
        callback(error);
      });
  } else {
    myCache.get(`${params}_token_key`, function(err, value) {
      if (!err) {
        if (value == undefined) {
          callback("key not found", null);
        } else {
          console.log("sending the cached version of the full response");
          callback(null, value);
        }
      }
    });
  }
};

module.exports.fetchSpringshare = fetchSpringshare;
