module.exports = function(RED) {

	const WesClient = require('./wes-client.js');
	
	function WesRelayCommand(config) {
        RED.nodes.createNode(this, config);
		
		this.server = RED.nodes.getNode(config.server);
		
		const relayId = config.number || 1;
		const action = config.action;

        // Store the node instance for later use
        const node = this;
		var command = "";

        // Handle incoming messages
        this.on('input', async function(msg, send, done) {
			
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

			const client = new WesClient(this.server);
			const result = await client.sendCommand(command);
			node.trace("Received result: "+result)
			msg.payload = result
			send(msg);
			done();	
        });
    }

	RED.nodes.registerType("wes-relay", WesRelayCommand);
}
