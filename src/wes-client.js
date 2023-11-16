
const net = require('net');

class WesClient {

    constructor (server){
        this.host = server.host;
		this.port = server.port;
    }

    sendCommand(command){
		const _this = this
		return new Promise((resolve, reject) => {
			var result = null;
			const client = new net.Socket();
			client.inBuffer = ''; // Buffer to accumulate received data

			client.connect(_this.port, _this.host, function() {
				// Send the payload as ASCII string
				// node.trace("Send query " + msg.payload);
				client.end(command);
			});

			// Handle data received from the server
			client.on('data', function(data) {
				client.inBuffer += data.toString();
				
				// Check if the response ends with a newline character
				if (client.inBuffer.endsWith('\n')) {
					result = client.inBuffer.slice(0,-1);
					// Reset the response buffer for the next request
					client.inBuffer = '';
					resolve(result);
				}
			});

			// Handle errors
			client.on('error', function(err) {
				// node.error("TCP connection error: " + err.message);
				client.destroy();
				reject(err);
			});
		});
    }
}

module.exports = WesClient