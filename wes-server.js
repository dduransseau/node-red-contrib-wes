module.exports = function(RED) {
	
	function WesServerNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
    }
	
	RED.nodes.registerType("wes-server", WesServerNode);
}
