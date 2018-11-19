# edm-stream

Kafka consumer that streams messages from kafka to `edm-dashboard`.

Created with Blizzard's node.js kafka consumer: [node-rdkafka](https://github.com/Blizzard/node-rdkafka) and socket.io.

This app is part of a group of apps that all must be deployed in a particular order:

1. [edm-relay](https://github.com/trevorscott/edm-relay)
1. [edm-stream](https://github.com/trevorscott/edm-stream)
1. [edm-stats](https://github.com/trevorscott/edm-stats)
1. [edm-ui](https://github.com/trevorscott/edm-ui)
1. [edm-dashboard](https://github.com/trevorscott/edm-dashboard)

# Deploy

## Initial Setup

```
git clone git@github.com:trevorscott/edm-stream.git && cd edm-stream
heroku create $app_name
```

## Kafka Setup

You should have created a multi-tenant kafka cluster with `edm-relay`. You will need to share that cluster with this app. 

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

You must also get the consumer-group id :

```
heroku kafka:consumer-groups
```

## Config
You will need to tell `edm-stream` which topics to listen to

```
heroku config:set KAFKA_TOPIC="edm-ui-click,edm-ui-pageload"
heroku config:set KAFKA_CONSUMER_GROUP="edm-consumer-group-1"
```

## Deploy

```
git push heroku master
```

## Scale Up

Scale up your service to avoid sleeping dynos.

```
heroku ps:scale web=1:standard-1x
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

You should have already set up your kafka cluster when you set up `edm-relay`. You will need to set the kafka dev topics and dev consumer group names as enviornment variables. See [edm-relay](https://github.com/trevorscott/edm-relay/blob/master/README.md#kafka-setup) for more information.

You will also need to grab information from your existing kafka cluster (`heroku config`) and set all of the required config on your local machine:

```
export KAFKA_PREFIX=<your kafka prefix>
export KAFKA_CONSUMER_GROUP='edm-consumer-group-1-local'
export KAFKA_URL=<your broker urls> 
export KAFKA_TOPIC='edm-ui-click-local,edm-ui-pageload-local'
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


## Write SSL Config to File
```
chmod +x .profile
./.profile
```

## Run your app

Start the server from root:

```
npm start
```

