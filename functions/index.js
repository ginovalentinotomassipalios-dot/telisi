const {onRequest} = require("firebase-functions/v2/https");

exports.healthCheck = onRequest((req, res) => {
  res.send("Telisi Functions OK");
});
