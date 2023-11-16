module.exports = function(RED) {

	const WesClient = require('./wes-client.js');
	
	function WesVSwitch(config) {
        RED.nodes.createNode(this, config);
		
		this.server = RED.nodes.getNode(config.server);
		
		// Store the node instance for later use
        const node = this;

        const vswitchId = config.number;
		const action = config.action;
        var command = "";
	
        // Handle incoming messages
        this.on('input', async function(msg, send, done) {
            if (action == 'toggle'){
				command = "fvs=" + vswitchId
			} else if (action == 'on'){
				command = "vs" + vswitchId +"=1"
			} else if (action == 'off'){
				command = "vs" + vswitchId + "=0"
			} else {
				node.error("Action not supported, must be toggle, on or off, received: "+action);
                return;
			}

			const client = new WesClient(this.server);
			const result = await client.sendCommand(command);
			node.trace("Received result: "+result)
			msg.payload = result
			send(msg);
			done();	
			
        });
    }	
	RED.nodes.registerType("wes-vswitch", WesVSwitch);
}
