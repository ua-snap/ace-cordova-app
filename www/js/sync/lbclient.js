// Do not modify.  From ace-api repo
'use strict';
if(self.importScripts !== undefined)
{
	var client = (function() {
		return require('lbclient');
	})();
	
	if(window.angular !== undefined) {
		angular.module('ace.services')
			.value('Group', client.models.LocalGroup)
			.value('RemoteGroup', client.models.RemoteGroup)
			.value('MobileUser', client.models.LocalMobileUser)
			.value('RemoteMobileUser', client.models.RemoteMobileUser)
			.value('Position', client.models.LocalPosition)
			.value('RemotePosition', client.models.RemotePosition)
			.value('WeatherReport', client.models.LocalWeatherReport)
			.value('RemoteWeatherReport', client.models.RemoteWeatherReport)
			.value('sync', client.sync)
			.value('network', client.network)
			.value('getReadableModelId', client.getReadableModelId);
	};
}

	