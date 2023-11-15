const http = require('http');
const fileSystem = require('fs');
const path = require('path');

var CITY = ""
var API_KEY = ""

////////////// COMMAND LINE ARGUMENTS ////////////////////////
const getArgumentsCommandLine = () => {
    const argv = require('minimist')(process.argv.slice(2));
    if(argv['s'])
        CITY = argv['s']
    if(argv['t'])
        API_KEY = argv['t']
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
}
/////////////////////////////////////////////////////////////

const getRequestToWeatherAPI = (pathURL) => {
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
}

fileSystem.readFile(path.resolve(__dirname, 'weather-config.json'), (error, data) => {
    getArgumentsCommandLine();
    if(error && API_KEY == "" && CITY == ""){
        console.log("Missing weather-config.json ... and you didn't enter arguments for city and apiKey ...")
    }else{
        let weatherConfig = "";
        if(!error) weatherConfig = JSON.parse(data);
        if(CITY == "") CITY = weatherConfig.city;
        if(API_KEY == "") API_KEY = weatherConfig.apiKEY;

        const baseUrl = 'http://api.weatherapi.com/v1/current.json?';
        let pathURL = "";
        pathURL = `${baseUrl}key=${API_KEY}&q=${CITY}&aqi=no`;

        getRequestToWeatherAPI(pathURL);
    }
})