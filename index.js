require('dotenv').config();
const Kafka      = require('node-rdkafka');
const express    = require('express');
const app        = express();
const server     = require('http').createServer(app);
const socket     = require('socket.io')(server);
const URL        = require('url');

const PORT       = process.env.PORT || 5001;
const nodeEnv    = process.env.NODE_ENV || 'development';
const fs         = require('fs');

const currentPath  = process.cwd();
require('./write-certs-to-file.js')(currentPath);

// Kafka Config
const kafkaBrokerUrls = process.env.KAFKA_URL;
const kafkaTopics = `${process.env.KAFKA_PREFIX}${process.env.KAFKA_TOPIC}`;
let brokerHostnames = kafkaBrokerUrls.split(",").map((u)=>{
  return URL.parse(u).host;
});

//
// Kafka Consumer w/ socket.io
//

// different consumer groupIDs for local dev & prod
var consumer = new Kafka.KafkaConsumer({
  'debug': 'all',
  'group.id': `${process.env.KAFKA_PREFIX}${process.env.KAFKA_CONSUMER_GROUP}`,
  'metadata.broker.list': brokerHostnames.toString(),
  'security.protocol': 'SSL',
  'ssl.ca.location':          `${currentPath}/temp-ssl/KAFKA_TRUSTED_CERT`,
  'ssl.certificate.location': `${currentPath}/temp-ssl/KAFKA_CLIENT_CERT`,
  'ssl.key.location':         `${currentPath}/temp-ssl/KAFKA_CLIENT_CERT_KEY`,
  'enable.auto.commit': true
}, {});

consumer
  .on('ready', function(arg) {
    console.log('Kafka consumer ready.' + JSON.stringify(arg));
    consumer.subscribe([kafkaTopics]);
    consumer.consume();
  })
  .on('data', function(data) {
    const message = data.value.toString()
    console.log(message, `Offset: ${data.offset}`, `partition: ${data.partition}`);
    console.log(consumer.assignments());
    // writeMessageToPostgres(message,consumer,data);
    socket.sockets.emit('event', message);
  })
  .on('event.log', function(log) {
    console.log(log);
  })
  .on('event.error', function(err) {
    console.error('Error from consumer');
    console.error(err);
  });

consumer.connect();


//
// Server
//

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});


