# edm-stream

Kafka consumer that streams messages from kafka to `edm-dashboard`.

Created with Blizzard's node.js kafka consumer: [node-rdkafka](https://github.com/Blizzard/node-rdkafka) and socket.io.

This app is part of a group of apps that all must be deployed in a particular order:

EDM-Relay (with Kafka Cluster)
EDM-UI
EDM-Stream
EDM-Dashboard

# Deploy

## Initial Setup

```
git clone 
heroku create $appname
```

## Kafka Setup

You should have created a multi-tenant kafka cluster with EDM-UI. You will need to share that cluster with this app. 

First get the kafka cluster id:

```bash
heroku addons -a $edm-relay-app-name
```
Which will return:

```
heroku-kafka (kafka-haiku-id)  basic-0  $100/month  created
```

Grab the id `kafka-haiku-id`.

```bash
heroku addons:attach <kafka-haiku-id> -a $app_name
```

Where `$app_name` is the name of this app.

## Config
```
heroku config:set KAFKA_TOPIC=<your_kafka_topic>
```

## Deploy

```
git push heroku master
```

# local dev

## Mac OS High Sierra

OpenSSL has been upgraded in High Sierra and homebrew does not overwrite default system libraries. That means when building node-rdkafka, because you are using openssl, you need to tell the linker where to find it:

```
export CPPFLAGS=-I/usr/local/opt/openssl/include
export LDFLAGS=-L/usr/local/opt/openssl/lib
```

Then you can run npm install on your application to get it to build correctly.

See https://github.com/Blizzard/node-rdkafka#mac-os-high-sierra for more details.

## Set Up
```
  git clone 
  npm install
```

## Required config

You will need to grab information from your existing kafka cluster and set all of the required config vars on your local machine:

```
export KAFKA_URL=<your broker urls> \
export KAFKA_TOPIC=<name of kafka topic>
export KAFKA_TRUSTED_CERT="multi
line 
cert"
export KAFKA_CLIENT_CERT="multi
line
cert"
export KAFKA_CLIENT_CERT_KEY="multi
line
cert
"
```

These files must contain values generated from your [kafka addon SSL config vars](https://devcenter.heroku.com/articles/kafka-on-heroku#connecting-to-a-kafka-cluster).

## Data

### Event Schema

```json
{
  "event_name": "test",
  "event": "test-event",
  "event_timestamp": "now",
  "properties": {}
}
```

## Run your app

Start the server from root:

```
npm start
```

