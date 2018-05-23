var config = {};

config.url = {};

config.web = {};
config.web.port = '3000';

config.icecast = {};
config.icecast.auth = 	{
                            auth: {
                            	user: 'admin',
                            	pass: '31ypq8X18LSR',
                            	sendImmediately: false
                          	}
                        };
config.icecast.listclients = 'http://177.54.158.150:8000/admin/listclients.xsl?mount=/airtime_128';
config.icecast.stats       = 'http://177.54.158.150:8000/admin/stats';

config.airtime = {};
config.airtime.liveinfo = 'http://177.54.158.150/api/live-info/?callback';

module.exports = config;