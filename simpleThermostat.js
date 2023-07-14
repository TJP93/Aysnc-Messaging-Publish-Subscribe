var mqtt = require('async-mqtt');
// var client = mqtt.connect('mqtt://localhost');
const dataTopic = 'home/thermostats';

const connectOptions = {
    // TODO options to be investigated
}

var client = mqtt.connect('mqtt://localhost', connectOptions);

let generateTemperature = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1) + min )
}
let location = process.argv[2];
if (!location || location.length == 0) {
    location = "hall";
}

console.log("Thermostat location: " + location);

client.on("connect", () => {
    console.log("Thermostat connected ");
    publishTelemetry();
});

// publish a fake thermostat reading every 10 seconds
function publishTelemetry() {
    // let temperature = generateTemperature(90, 115);
    setInterval(() => { 
        const reading = {
            "location": location,
            "time": Date.now(),
            "temperature": generateTemperature(95, 101)
        };
        const message = JSON.stringify(reading);
        const options = {
           "retain" : true,
        };
        client.publish(dataTopic, message, options).then((e) => {
            if (e) {
                console.log("Error:" + JSON.stringify(e));
            } else {
                console.log("OK " + JSON.stringify(reading));
            }

        });
    }, 1000 * 10);
}

