import * as AWS from "aws-sdk";
import * as Paho from "paho-mqtt";

export const state = () => ({
  client: null
});

export const mutations = {
  SET_CLIENT(state, newValue) {
    state.client = newValue;
  }
};

export const actions = {
  async connect({ dispatch, commit, state }, { deviceId, callback } = {}) {
    dispatch("disconnect");
    const host = "azyj6m3vu5398-ats.iot.us-west-2.amazonaws.com";
    const clientId = randomString();
    const region = "us-west-2";
    const creds = await dispatch("auth/getCurrentCredentials", undefined, { root: true });

    const topic = `${creds.identityId}/${deviceId}`;
    var endpoint = SigV4Utils.getSignedUrl(host, region, creds);
    const client = new Paho.Client(endpoint, clientId);
    client.onMessageArrived = onMessageArrived;
    client.onConnectionLost = onConnectionLost;
    client.connect({
      useSSL: true,
      mqttVersion: 4,
      onSuccess: function() {
        console.log("Connected to MQTT");
        commit("SET_CLIENT", client);
        client.subscribe(topic, {
          onSuccess: function() {
            console.log("Subsribed to topic");
          }
        });
      },
      onFailure: function(e) {
        console.log(e);
      }
    });

    function onConnectionLost(responseObject) {
      console.log(responseObject);
    }

    function onMessageArrived(message) {
      callback(JSON.parse(message.payloadString));
    }
  },

  disconnect({ commit, state }) {
    if (state.client != null) state.client.disconnect();
    commit("SET_CLIENT", null);
    console.log("Client disconnected");
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

function randomString() {
  return Math.random()
    .toString(36)
    .slice(-5);
}
