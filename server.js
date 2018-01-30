const axios = require("axios");
const NodeCache = require("node-cache");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const myCache = new NodeCache();
const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    credentials: true,
    origin: true
  })
);

/*** LOGGING */
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile(`server.log`, log + "\n", err => {
    if (err) {
      console.log(`Unable to append to server.log`);
    }
  });
  next();
});

/*** BASIC HOMEPAGE */
app.get("/", (req, res, next) => {
  res.send(`<h1>SpringShare API 1.2 Auth Server</h1>`);
});

/****************************
 * LibCal*
 * **************************/

app.get("/springshare/libcal/:passthrough", (req, res, next) => {
  const cleanParams0 = req.query.what.substr(1);
  const cleanParams = cleanParams0.substr(0, cleanParams0.length - 1);
  const urlFront = "https://api2.libcal.com/1.1";

  const springshareAuth = require("./springshare/springshareAuth");
  const fetchSpringshare = require("./springshare/fetch-springshare");
  const service = "libcal";
  const springshareAuthObj = {
    client_id: "ENV[LIBCAL_CLIENT_ID]",
    client_secret: "ENV[LIBCAL_CLIENT_SECRET]",
    grant_type: "client_credentials"
  };
  let sendSpringshareResults = (err, content) => {
    if (err) {
      return res.send(err);
    }
    return res.json(content);
  };
  let gSpSt = (err, token) => {
    if (err) {
      return res.send("ahhhhh!,", err);
    }
    fetchSpringshare.fetchSpringshare(token, cleanParams, urlFront, sendSpringshareResults);
  };

  springshareAuth.springshareAuth(springshareAuthObj, service, gSpSt);
});

/****************************
 * LibGuides*
 * **************************/
app.get("/springshare/libguides/:passthrough", (req, res, next) => {
  const lgAuthObj = {
    client_id: "ENV[LIBGUIDES_CLIENT_ID]",
    client_secret: "ENV[LIBGUIDES_CLIENT_SECRET]",
    grant_type: "client_credentials"
  };
  const service = "libguides";
  const cleanParams0 = req.query.what.substr(1);
  const cleanParams = cleanParams0.substr(0, cleanParams0.length - 1);
  const urlFront = "https://lgapi-us.libapps.com/1.2";
  const springshareAuth = require("./springshare/springshareAuth");
  const fetchSpringshare = require("./springshare/fetch-springshare");

  let sendSpringshareResults = (err, content) => {
    if (err) {
      return res.send(err);
    }
    return res.json(content);
  };
  let gSpSt = (err, token) => {
    if (err) {
      return res.send("ahhhhh!,", err);
    }
    fetchSpringshare.fetchSpringshare(token, cleanParams, urlFront, sendSpringshareResults);
  };

  springshareAuth.springshareAuth(lgAuthObj, service, gSpSt);
});

app.listen(port, () => {
  console.log(`Server is ready on port ${port}.`);
});
