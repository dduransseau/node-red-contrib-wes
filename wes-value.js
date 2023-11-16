module.exports = function(RED) {
	
	function WesCommandRequest(config) {
        RED.nodes.createNode(this, config);
		
		this.server = RED.nodes.getNode(config.server);
		const WesClient = require('./wes-client.js');
		const SERVICES = require('./values.json');
        const node = this;
		node.services = this.server.services;
		const command = config.value;

		if (command === undefined){
			return;
		}

        // Handle incoming messages
        this.on('input', async function(msg, send, done) {
			const client = new WesClient(this.server);
			const result = await client.sendCommand(command);
			const valueMeta = SERVICES.values[command];
			node.trace(valueMeta.label + " : " + result + " type: " + valueMeta.type);
			msg.payload = {"value": result, "label": valueMeta.label, "command": command};
			if (valueMeta.type === "number"){
				msg.payload.value = parseFloat(result);
			}
			send(msg);
			done();	
        });
    }
	RED.nodes.registerType("wes-value", WesCommandRequest);
}
