var fs = require('fs');
var express = require('express');
var request = require('request');
var httpProxy = require('http-proxy');
var Random = require('random-js');

var random = new Random(Random.engines.mt19937().autoSeed());
var proxy   = httpProxy.createProxyServer({});
var app = express();

var alertFlag = false;

var stableInstances = [];
var canaryInstances = [];


///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  console.log("AlertFlag Status: ", alertFlag);
  var serverFulfillingReq;
  if(random.bool(0.8) || alertFlag === true) { 
    serverFulfillingReq = stableInstances[random.integer(0,stableInstances.length-1)];  
  } else {
    serverFulfillingReq = canaryInstances[random.integer(0,canaryInstances.length-1)];
  }
  console.log("Server Fulfilling Request: http://"+serverFulfillingReq+"/");
  proxy.web(req, res, {target: "http://"+serverFulfillingReq+":80" });
});

//Poll the canary instance every 3 seconds as long as no alert flag
var poll = setInterval(function() {
  try {
    console.log("Polling Canary Instance !");
    request("http://"+canaryInstances[0]+":80/api/study/vote/status",{timeout: 1200}, function (error, res, val) {
        if( res == null || res.statusCode != 200) {
          console.log("Polling Failed !!!ALERT!!!");
          alertFlag = true;
          clearInterval(poll);
      }
    });
  } catch(e) {
    console.log("Polling Failed !!!ALERT!!!");
    alertFlag = true;
    clearInterval(poll);
  }
}, 3000);

// HTTP SERVER
app.listen(3002, function () {
  
  var stable = fs.readFileSync('/home/ubuntu/stable').toString().split("\n");
  var canary = fs.readFileSync('/home/ubuntu/canary').toString().split("\n");
  
  for(var i=0; i<canary.length-1; i++) {
    canaryInstances.push(canary[i]);
  }
  
  for(var i=0; i<stable.length-1; i++) {
    stableInstances.push(stable[i]);
  }
});