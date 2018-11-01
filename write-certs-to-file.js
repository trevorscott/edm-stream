require('dotenv').config();
const fs           = require('fs');

module.exports = function(currentPath) {
  
  const tempSSLDir   = `${currentPath}/temp-ssl`;
  
  if (!fs.existsSync(tempSSLDir)){
      fs.mkdirSync(tempSSLDir);
  }

  if (!fs.existsSync(`${tempSSLDir}/KAFKA_TRUSTED_CERT`)) {
    // Write Kafka SSL info to filesystem
    fs.writeFile(`${tempSSLDir}/KAFKA_TRUSTED_CERT`, process.env.KAFKA_TRUSTED_CERT, function(err) {
        if(err) {
            console.error("Error writing Kafka ssl info to filesystem.");
        }
    }); 
  }

  if (!fs.existsSync(`${tempSSLDir}/KAFKA_CLIENT_CERT`)) {
    fs.writeFile(`${tempSSLDir}/KAFKA_CLIENT_CERT`, process.env.KAFKA_CLIENT_CERT, function(err) {
        if(err) {
            console.error("Error writing Kafka ssl info to filesystem.");
        }
    });
  }

  if (!fs.existsSync(`${tempSSLDir}/KAFKA_CLIENT_CERT_KEY`)) {
    fs.writeFile(`${tempSSLDir}/KAFKA_CLIENT_CERT_KEY`, process.env.KAFKA_CLIENT_CERT_KEY, function(err) {
        if(err) {
            console.error("Error writing Kafka ssl info to filesystem.");
        }
    });
  }
}
