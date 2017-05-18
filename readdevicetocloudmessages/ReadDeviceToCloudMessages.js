'use strict';

var EventHubClient = require('azure-event-hubs').Client;
//var connectionString = 'HostName=KumarHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=X+MOuzcG09Hq15HSnHujlmHeiQNmauxf6WPlHPstqWY=';
var connectionString = 'HostName=marsiotphl.azure-devices.net;SharedAccessKeyName=coffeeclient;SharedAccessKey=MIj+k5Q8CdX+dtdfMNGqdtOGoia90mEQmE9Jqd8OdVo=';
var printError = function (err) {
  console.log(err.message);
};

var printMessage = function (message) {
  console.log('Message received: ');
  console.log(JSON.stringify(message.body));
  console.log('');
};


var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$team12', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);
