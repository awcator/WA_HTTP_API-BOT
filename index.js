const request = require('request');
const express = require('express');
const app = express();
const wppconnect = require('@wppconnect-team/wppconnect');
var whatsappclient;
var banner=`


												   tttt                                               
												ttt:::t                                               
												t:::::t                                               
												t:::::t                                               
  aaaaaaaaaaaaawwwwwww           wwwww           wwwwwww cccccccccccccccc  aaaaaaaaaaaaa  ttttttt:::::ttttttt       ooooooooooo   rrrrr   rrrrrrrrr   
  a::::::::::::aw:::::w         w:::::w         w:::::wcc:::::::::::::::c  a::::::::::::a t:::::::::::::::::t     oo:::::::::::oo r::::rrr:::::::::r  
  aaaaaaaaa:::::aw:::::w       w:::::::w       w:::::wc:::::::::::::::::c  aaaaaaaaa:::::at:::::::::::::::::t    o:::::::::::::::or:::::::::::::::::r 
	   a::::a w:::::w     w:::::::::w     w:::::wc:::::::cccccc:::::c           a::::atttttt:::::::tttttt    o:::::ooooo:::::orr::::::rrrrr::::::r
    aaaaaaa:::::a  w:::::w   w:::::w:::::w   w:::::w c::::::c     ccccccc    aaaaaaa:::::a      t:::::t          o::::o     o::::o r:::::r     r:::::r
  aa::::::::::::a   w:::::w w:::::w w:::::w w:::::w  c:::::c               aa::::::::::::a      t:::::t          o::::o     o::::o r:::::r     rrrrrrr
 a::::aaaa::::::a    w:::::w:::::w   w:::::w:::::w   c:::::c              a::::aaaa::::::a      t:::::t          o::::o     o::::o r:::::r            
a::::a    a:::::a     w:::::::::w     w:::::::::w    c::::::c     ccccccca::::a    a:::::a      t:::::t    tttttto::::o     o::::o r:::::r            
a::::a    a:::::a      w:::::::w       w:::::::w     c:::::::cccccc:::::ca::::a    a:::::a      t::::::tttt:::::to:::::ooooo:::::o r:::::r            
a:::::aaaa::::::a       w:::::w         w:::::w       c:::::::::::::::::ca:::::aaaa::::::a      tt::::::::::::::to:::::::::::::::o r:::::r            
 a::::::::::aa:::a       w:::w           w:::w         cc:::::::::::::::c a::::::::::aa:::a       tt:::::::::::tt oo:::::::::::oo  r:::::r            
  aaaaaaaaaa  aaaa        www             www            cccccccccccccccc  aaaaaaaaaa  aaaa         ttttttttttt     ooooooooooo    rrrrrrr            





																		      `;
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
	whatsappclient = client; //It will be used in REST requests
	console.log(banner);
	client.onMessage( async (message) => {
		console.log(message)
		request.post(
			"localhost:5555",
			{
				json: message,
				maxAttempts: 2,
				retryDelay: 1000,
				retryStrategy: request.RetryStrategies.HTTPOrNetworkError
			},
			(error, res, body) => {
				if (error) {
					this.log.error(error)
					return
				}
				this.log.log(`POST request was sent with status code: ${res.statusCode}`)
				this.log.verbose(`Response: ${JSON.stringify(body)}`)
			})
	}); 

	client.onAck(ack => {

	});

	client.onStateChange( async (state) => {

	});
}

//API Stuff

//curl  http://localhost:6969/getconnectionstatus
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
console.log('API Server started at localhost:%s', server.address().port);

