const express = require('express');
const app = express();
const wppconnect = require('@wppconnect-team/wppconnect');
var whatsappclient;

app.use(express.json());//parser used for requests via post,
app.use(express.urlencoded({ extended : true }));


async function startWPP (){
	await wppconnect.create({session: 'awcator_bot',
		catchQR: (base64Qr, asciiQR, attempts, urlCode) => {},  
		statusFind: (statusSession, session) => {
			console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
			//Create session wss return "serverClose" case server for close
			console.log('Session name: ', session);
		},
		headless: true, // Headless chrome
		devtools: false, // Open devtools by default
		useChrome: true, // If false will use Chromium instance
		debug: true, // Opens a debug session
		logQR: true, // Logs QR automatically in terminal
		browserWS: '', // If u want to use browserWSEndpoint
		browserArgs: [''], // Parameters to be added into the chrome browser instance
		puppeteerOptions: {}, // Will be passed to puppeteer.launch
		disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
		updatesLog: true, // Logs info updates automatically in terminal
		autoClose: 60000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
		tokenStore: 'file', // Define how work with tokens, that can be a custom interface
		folderNameToken: './tokens', //folder name when saving tokens
	}).then((client) => {
		//At this point Client is logged in and setup the hooks like. onMessage() onAck() & etc
		start(client);
	}).catch((erro) => console.log(erro));
}

//Api Hoooks
async function start(client) {
	wc = client; //It will be used in REST requests
	client.onMessage( async (message) => {
		console.log(message);
	}); 
	
	client.onAck(ack => {

	});
	
	client.onStateChange( async (state) => {

	});
}

//API Stuff
app.get('/getconnectionstatus', async function (req, res) {
	console.log("Requested connection status");
	var response =''; // request return message
	var sucess = false; //If the request was successful
	var return_object;
	const executa = async()=>{
		if (typeof(whatsappclient) === "object"){ //Validating if lib is started
			response = await whatsappclient.getConnectionState(); // whats connection status validated
			sucess = true;
		}else{
			response = 'whatsappclient was not initialized';               
		}
		return_object = {
			status : sucess,
			message : response,           
		};
		res.send(return_object); 
	};
	executa();
});

startWPP(); //call function to initialize the lib  wppconnect-team/wppconnect
const api_port = '6969'; 
var server = app.listen(api_port);
console.log('Server Intitaled at localhost:%s', server.address().port);
