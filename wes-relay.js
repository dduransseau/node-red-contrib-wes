module.exports = function(RED) {
	
	function WesRelayCommand(config) {
        RED.nodes.createNode(this, config);
		
		this.server = RED.nodes.getNode(config.server);
		
		if (this.server) {
            // Do something with:
            //  this.server.host
            //  this.server.port
			this.host = this.server.host;
			this.port = this.server.port;
        } else {
            // No config node configured
			node.error("No config node configured");
        }
		const relayId = config.number || 1;
		const action = config.action;

        // Create a TCP client
        const net = require('net');
        let client = null;

        // Store the node instance for later use
        const node = this;
		var command = "";

        // Handle incoming messages
        this.on('input', function(msg, send, done) {
            // Ensure the message has a payload
            if (!msg.payload) {
                node.error("Message payload is empty.");
                return;
            }
			client = new net.Socket();
			client.inBuffer = ''; // Buffer to accumulate received data
			
			if (action == 'toggle'){
				command = "frl=" + relayId
				
			} else if (action == 'on'){
				command = "srl" + relayId +"=1"
				
			} else if (action == 'off'){
				command = "srl" + relayId + "=0"
				
			} else if (action == 'impulse'){ // TODO: control that payload is a number between 1 and 65535
				command = "trl" + relayId + "="+msg.payload
				
			} else {
				node.error("Action not supported, must be toggle, on or off, received: "+action);
			}

			if (command != ""){
				// Connect to the TCP server
				client.connect(node.port, node.host, function() {
					// Send the payload as ASCII string
					node.warn("Send query " + msg.payload);
					client.end(command);
				});
			}
            // Handle data received from the server
            client.on('data', function(data) {
				client.inBuffer += data.toString();
				
				// Check if the response ends with a newline character
                if (client.inBuffer.endsWith('\n')) {
                    msg.payload = client.inBuffer.slice(0,-1);
                    node.send(msg); // Send the response to the next node

                    // Reset the response buffer for the next request
                    client.inBuffer = '';

                    // Close the connection
                    client.end();
				}
            });
			
			client.on('end', function(data) {
				// Close the client connection
				// node.warn("Close the client connection");
				client.destroy();
				done();
			});

            // Handle errors
            client.on('error', function(err) {
                node.error("TCP connection error: " + err.message);
                client.destroy();
				done();
            });
        });
    }	
	RED.nodes.registerType("wes-relay", WesRelayCommand);
}
