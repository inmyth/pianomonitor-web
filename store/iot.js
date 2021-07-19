import * as AWS from "aws-sdk";
import * as Paho from "paho-mqtt";

export const state = () => ({});

export const mutations = {};

export const actions = {
  async connect({ dispatch }) {
    const host = "azyj6m3vu5398-ats.iot.us-west-2.amazonaws.com";
    const topic = "b2f187c3-c806-4c08-afc0-2f00070c0fe8";
    const clientId = "b2f187c3-c806-4c08-afc0-2f00070c0fe8";
    const region = "us-west-2";
    const creds = await dispatch("auth/getCurrentCredentials", undefined, { root: true });

    var endpoint = SigV4Utils.getSignedUrl(host, region, creds);
    const client = new Paho.Client(endpoint, clientId);
    client.onMessageArrived = onMessageArrived;
    client.onConnectionLost = onConnectionLost;
    client.connect({
      useSSL: true,
      mqttVersion: 4,
      onSuccess: function() {
        console.log("Connected to MQTT");

        client.subscribe(
          topic,

          {
            onSuccess: function() {
              console.log("Subsribed to topic");
            }
          }
        );
      },
      onFailure: function(e) {
        console.log(e);
      }
    });

    function onConnectionLost(responseObject) {
      console.log(responseObject);
    }

    function onMessageArrived(message) {
      console.log("onMessageArrived:" + message.payloadString);
    }
    // client.onMessageArrived = function(message) {
    //   console.log(message);
    // };
  }
};

function SigV4Utils() {}

SigV4Utils.getSignatureKey = function(key, date, region, service) {
  var kDate = AWS.util.crypto.hmac("AWS4" + key, date, "buffer");
  var kRegion = AWS.util.crypto.hmac(kDate, region, "buffer");
  var kService = AWS.util.crypto.hmac(kRegion, service, "buffer");
  var kCredentials = AWS.util.crypto.hmac(kService, "aws4_request", "buffer");
  return kCredentials;
};
SigV4Utils.getSignedUrl = function(host, region, credentials) {
  var datetime = AWS.util.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, "");
  var date = datetime.substr(0, 8);
  var method = "GET";
  var protocol = "wss";
  var uri = "/mqtt";
  var service = "iotdevicegateway";
  var algorithm = "AWS4-HMAC-SHA256";
  var credentialScope = date + "/" + region + "/" + service + "/" + "aws4_request";
  var canonicalQuerystring = "X-Amz-Algorithm=" + algorithm;
  canonicalQuerystring += "&X-Amz-Credential=" + encodeURIComponent(credentials.accessKeyId + "/" + credentialScope);
  canonicalQuerystring += "&X-Amz-Date=" + datetime;
  canonicalQuerystring += "&X-Amz-SignedHeaders=host";
  var canonicalHeaders = "host:" + host + "\n";
  var payloadHash = AWS.util.crypto.sha256("", "hex");
  var canonicalRequest = method + "\n" + uri + "\n" + canonicalQuerystring + "\n" + canonicalHeaders + "\nhost\n" + payloadHash;
  var stringToSign = algorithm + "\n" + datetime + "\n" + credentialScope + "\n" + AWS.util.crypto.sha256(canonicalRequest, "hex");
  var signingKey = SigV4Utils.getSignatureKey(credentials.secretAccessKey, date, region, service);
  var signature = AWS.util.crypto.hmac(signingKey, stringToSign, "hex");
  canonicalQuerystring += "&X-Amz-Signature=" + signature;
  if (credentials.sessionToken) {
    canonicalQuerystring += "&X-Amz-Security-Token=" + encodeURIComponent(credentials.sessionToken);
  }
  var requestUrl = protocol + "://" + host + uri + "?" + canonicalQuerystring;
  return requestUrl;
};

// function SigV4Utils() {}

// SigV4Utils.sign = function(key, msg) {
//   var hash = CryptoJS.HmacSHA256(msg, key);
//   return hash.toString(CryptoJS.enc.Hex);
// };

// SigV4Utils.sha256 = function(msg) {
//   var hash = CryptoJS.SHA256(msg);
//   return hash.toString(CryptoJS.enc.Hex);
// };

// SigV4Utils.getSignatureKey = function(key, dateStamp, regionName, serviceName) {
//   var kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
//   var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
//   var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
//   var kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
//   return kSigning;
// };

// function createEndpoint(regionName, awsIotEndpoint, accessKey, secretKey) {
//   //   var time = moment.utc();
//   //   var dateStamp = time.format('YYYYMMDD');
//   var date = new Date();
//   var dateStamp = `${date.getUTCFullYear()}${date.getUTCMonth() + 1}${date.getUTCDate()}`;
//   //   var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
//   var amzdate = dateStamp + "T" + `${date.getUTCHours()}${date.getUTCMinutes()}${date.getUTCSeconds()}` + "Z";
//   var service = "iotdevicegateway";
//   var region = regionName;
//   var secretKey = secretKey;
//   var accessKey = accessKey;
//   var algorithm = "AWS4-HMAC-SHA256";
//   var method = "GET";
//   var canonicalUri = "/mqtt";
//   var host = awsIotEndpoint;

//   var credentialScope = dateStamp + "/" + region + "/" + service + "/" + "aws4_request";
//   var canonicalQuerystring = "X-Amz-Algorithm=AWS4-HMAC-SHA256";
//   canonicalQuerystring += "&X-Amz-Credential=" + encodeURIComponent(accessKey + "/" + credentialScope);
//   canonicalQuerystring += "&X-Amz-Date=" + amzdate;
//   canonicalQuerystring += "&X-Amz-SignedHeaders=host";

//   var canonicalHeaders = "host:" + host + "\n";
//   var payloadHash = SigV4Utils.sha256("");
//   var canonicalRequest = method + "\n" + canonicalUri + "\n" + canonicalQuerystring + "\n" + canonicalHeaders + "\nhost\n" + payloadHash;

//   var stringToSign = algorithm + "\n" + amzdate + "\n" + credentialScope + "\n" + SigV4Utils.sha256(canonicalRequest);
//   var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
//   var signature = SigV4Utils.sign(signingKey, stringToSign);

//   canonicalQuerystring += "&X-Amz-Signature=" + signature;
//   return "wss://" + host + canonicalUri + "?" + canonicalQuerystring;
// }
