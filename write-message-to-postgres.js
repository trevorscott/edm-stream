require('dotenv').config();
const { Client } = require('pg');


function writeMessageToPostgres(message,consumer,data) {
  // Connect to postgres
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: nodeEnv === 'production'
  });
  pgClient.connect();
  const json = JSON.parse(message)
  const insertEventText = 'INSERT INTO dfe_events(event_name,event,event_timestamp,host_name,app_name,properties) VALUES($1, $2, $3, $4, $5, $6)';
  const values = [json.eventName, json.event, json.eventTimestamp, json.hostName, json.appName, json.properties ? json.properties : null ];

  pgClient.query(insertEventText, values)
    .then(res => {
      console.log("Message successfully written to Postgres.")
      pgClient.end();
    })
    .catch(e => console.error(e.stack))
}