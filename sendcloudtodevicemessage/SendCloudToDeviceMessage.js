'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

//var connectionString = 'HostName=KumarHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=X+MOuzcG09Hq15HSnHujlmHeiQNmauxf6WPlHPstqWY=';
var connectionString = 'HostName=marsiotphl.azure-devices.net;SharedAccessKeyName=coffeeclient;SharedAccessKey=MIj+k5Q8CdX+dtdfMNGqdtOGoia90mEQmE9Jqd8OdVo=';

var targetDevice = 'coffeepot';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

function receiveFeedback(err, receiver){
  receiver.on('message', function (msg) {
    console.log('Feedback message:')
    console.log(msg.getData().toString('utf-8'));
  });
}

serviceClient.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Service client connected');
    serviceClient.getFeedbackReceiver(receiveFeedback);
    var message = new Message({"Command":"ping", "Team": "team12", "Parameters":"Hello"});
    message.ack = 'full';
    message.messageId = "My Message ID";
    console.log('Sending message: ' + message.getData());
    serviceClient.send(targetDevice, message, printResultFor('send'));
  }
});
