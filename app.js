/* Test interaction with twilio co-pilot configuration */

var express = require('express'),
  twilio = require('twilio'),
  bodyParser = require('body-parser')


var twilio_account_sid = process.env.TWILIO_SID;
var twilio_auth_token = process.env.TWILIO_AUTH_TOKEN;
var twilio_msg_sid = process.env.TWILIO_MSG_SID;

var app = express()
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var client = new twilio.RestClient(twilio_account_sid, twilio_auth_token);

app.get('/', function (req, res) {
  res.send('Interaction test')
})

app.get('/healthy', (req, res) => {
  res.status(200).send('OK');
});

app.post('/statuscallback', function (req, res) {
  console.log("\nStatus Callback msg", req.body);
  res.send('ok');
})

app.post('/inbound', function (req, res) {
  console.log("\nInbound request msg", req.body);
  res.send('ok');
})

app.get('/echo', function (req, res) {
  console.log("\nTest request msg", req.url);
  res.send('ok');
})

app.get('/send', function (req, res) {
  var to = req.query.to;
  //console.log(req);

  if(!to) {
    return res.status(500).send("Missing 'to' param\n");
  }

  client.messages.create({
    body: 'Sample Test : '+Date(),
    to: to,
    MessagingServiceSid: twilio_msg_sid
  }, function(err, message) {
    console.log("Send response on number",to);
    if(err) {
      console.log("ERR",err);
      return res.sendStatus(500);
    }
    console.log("Send Status:",message.status,"\n");
    console.log(message);
    res.send(message.status);
  });
})

const port = process.env.PORT || 3333;
app.listen(port, function() {
  console.log('Started twilio test on port',port);
});
