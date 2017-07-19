import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
import {MicroBuildConfig, ELabelNames, EPlugins} from "./.micro-build/x/microbuild-config";
import {JsonEnv} from "./.jsonenv/_current_result";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

/* Example config file */

const projectName = 'etcd';

build.baseImage('quay.io/coreos/etcd', 'latest');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.isInChina(JsonEnv.gfw.isInChina);

build.forwardPort(2379, 'tcp').publish(2379);
build.forwardPort(2380, 'tcp').publish(2380);
build.volume('./data-dir', '/data/data-dir');

build.startupCommand('/data/start.sh');
build.shellCommand('/bin/sh');

build.disablePlugin(EPlugins.jenv);
build.noDataCopy(true);
build.appendDockerFileContent(`
COPY start.sh ENV.sh /data/
`);

build.onConfig((isBuild) => {
	if (!isBuild) {
		return;
	}
	const WhoAmI = require(__dirname + '/who_am_i/who_am_i.js');
	const ServerIps = require(__dirname + '/who_am_i/get_server_ip.js');
	
	let CLUSTER = [];
	for (let server of Object.values(ServerIps)) {
		CLUSTER.push(`${server.id}=http://${server.internal}:2380`);
	}
	
	const config = helper.createTextFile(`
# SAME EVERY SERVER
TOKEN=${JSON.stringify(JsonEnv.serverRequestKey)}
CLUSTER_STATE="new"
CLUSTER=${JSON.stringify(CLUSTER.join(','))}
DATA_DIR="/data/data-dir"
LISTEN_IP="0.0.0.0"

# EACH SERVER
THIS_NAME="${WhoAmI.id}"
THIS_IP="${WhoAmI.internal}"
`);
	config.save('./ENV.sh');
});
