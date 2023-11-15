const http = require('http');
const fileSystem = require('fs');
const path = require('path');

const weatherConfig = JSON.parse(fileSystem.readFileSync(path.resolve(__dirname, 'weather-config.json')));
let city = weatherConfig.city || ''
let apiKEY = weatherConfig.apiKEY || ''
const baseUrl = 'http://api.weatherapi.com/v1/current.json?';

////////////// COMMAND LINE ARGUMENTS ////////////////////////
const argv = require('minimist')(process.argv.slice(2));
if(argv['s'])
    city = argv['s']
if(argv['t'])
    apiKEY = argv['t']
if(argv['h']){
    console.log("\n")
    console.log("INFORMATION MODE (Don't enter   -h   if you don't want recieve this message)")
    console.log("\n")
    console.log("NAME: WEATHER INFO")
    console.log("DESCRIPTION: To work, it's enough to run the script - node app.js")
    console.log("You can give special arguments: -s 'city', -t 'apiKEY', -h ('Info message')");
    console.log("\n")
    process.exit()
}
/////////////////////////////////////////////////////////////

let pathURL = "";
pathURL = `${baseUrl}key=${apiKEY}&q=${city}&aqi=no`;

const request = http.get(pathURL, (response) => {
    var buffer = "";
    response.on('data', (chunk) => {
        buffer += chunk;
    })

    response.on('end', (error) => {
        if(error)
            console.log("Something was wrong.....");
        else{
            const data = JSON.parse(buffer);

            if(data.error){
                console.log('\n')
                console.log(data.error.message)
                console.log('\n')
            }
            else{
                console.log('\n')
                console.log('CITY:', data['location'].name);
                console.log('TEMPERATURE:', data['current'].temp_c, '°C');
                console.log('TEMPERATURE FEELS LIKE:', data['current'].feelslike_c, '°C');
                console.log('\n')
            }
        }
    })
})