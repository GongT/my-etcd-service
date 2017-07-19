const JsonEnv = global.JsonEnv;
const debug = console.log.bind(console);

const serverGroupDefine = JsonEnv.deploy;
if (!serverGroupDefine || !Object.keys(serverGroupDefine).length) {
	throw new Error('no config.deploy exists');
}

const serverMap = {};
Object.keys(serverGroupDefine).forEach((networkGroup) => {
	if (networkGroup === 'forceServerId') {
		return;
	}
	serverGroupDefine[networkGroup].machines.forEach((d) => {
		const serverId = `${d.name}.${networkGroup}`;
		d.network = networkGroup;
		d.id = serverId;
		d.interface = serverGroupDefine[networkGroup].interface;
		serverMap[serverId] = d;
	});
});

debug('server map: %s', JSON.stringify(serverMap, null, 4));
module.exports = serverMap;
