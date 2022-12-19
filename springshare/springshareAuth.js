const axios = require("axios");
const NodeCache = require("node-cache");
require("dotenv").config();

const myCache = new NodeCache();

let springshareAuth = function (key, service, callback) {
  if (myCache.get(`${service}_token_key`) == undefined) {
    if (service == "libcal") {
      var authServer =
        "https://" + process.env.LIBCAL_ORGANIZATION_URL + "/1.1/oauth/token";
    } else {
      var authServer = "https://lgapi-us.libapps.com/1.2/oauth/token";
    }
    axios
      .post(authServer, key)
      .then(function (response) {
        access_token_4u = response.data.access_token;
      })
      .then(function (response) {
        myCache.set(
          `${service}_token_key`,
          access_token_4u,
          3500,
          function (err, success) {
            if (!err && success) {
              console.log("setting auth cache", success);
              return callback(null, access_token_4u);
            }
          }
        );
      })
      .catch(function (error) {
        console.log("garh", error);
      });
  } else {
    console.log("sup");
    myCache.get(`${service}_token_key`, function (err, value) {
      if (!err) {
        if (value == undefined) {
          console.log("key not found");
        } else {
          console.log("zing! cached versions");
          callback(null, value);
        }
      }
    });
  }
};

module.exports.springshareAuth = springshareAuth;
