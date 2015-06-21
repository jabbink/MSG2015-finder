var http = require('http');

var lowestRoom = 49318;

var isEmptyObject = function(obj) {
	return !Object.keys(obj).length;
}

var msgUsers = {
	"10098050": {
		"accountid": 10098050,
		"date": "2015-06-20T23:23:22.959Z",
		"name": "[MSG15 ADMIN] Mr. uLLeticaL\u2122",
		"room": 48858
	},
	"11662973": {
		"accountid": 11662973,
		"date": "2015-06-21T00:00:10.722Z",
		"name": "[MSG15 MOD] desolation",
		"room": 48293
	},
	"133090071": {
		"accountid": 133090071,
		"date": "2015-06-20T19:15:46.218Z",
		"name": "[MSG15 ADMIN]Mrs. uLLeticaL\u2122",
		"room": 48293
	},
	"2565066": {
		"accountid": 2565066,
		"date": "2015-06-21T11:01:54.723Z",
		"name": "[MSG15 MOD] Pawsed",
		"room": 48293
	},
	"28974871": {
		"accountid": 28974871,
		"date": "2015-06-21T00:38:38.710Z",
		"name": "[MSG15 ADMIN] x\u1d04\u1d00\u1d20\u1d0086x \u2602",
		"room": 48897
	},
	"446489": {
		"accountid": 446489,
		"date": "2015-06-21T11:30:11.076Z",
		"name": "[MSG15 FAN] Trouvist",
		"room": 48669
	},
	"45800824": {
		"accountid": 45800824,
		"date": "2015-06-20T22:38:50.247Z",
		"name": "[MSG15 MOD] Mithriael",
		"room": 48272
	},
	"59119854": {
		"accountid": 59119854,
		"date": "2015-06-20T10:46:12.034Z",
		"name": "[MSG15 MOD] alicia ws@d",
		"room": 47100
	},
	"6905879": {
		"accountid": 6905879,
		"date": "2015-06-20T20:27:51.741Z",
		"name": "[MSG15 MOD] iddqd",
		"room": 48725
	},
	"69178454": {
		"accountid": 69178454,
		"date": "2015-06-21T10:46:41.515Z",
		"name": "[MSG15 MOD] rhythm girl",
		"room": 48275
	},
	"79519465": {
		"accountid": 79519465,
		"date": "2015-06-20T19:15:45.932Z",
		"name": "[MSG15 ADMIN] Soragnamdan \u0472\u7a7a",
		"room": 48296
	},
	"8520498": {
		"accountid": 8520498,
		"date": "2015-06-21T11:21:57.370Z",
		"name": "[MSG15 ADMIN] Minz",
		"room": 49178
	},
	"89051843": {
		"accountid": 89051843,
		"date": "2015-06-21T01:10:01.319Z",
		"name": "[MSG15 ADMIN] /u/wchill",
		"room": 48915
	},
	"9727743": {
		"accountid": 9727743,
		"date": "2015-06-21T01:05:06.788Z",
		"name": "[MSG15 ADMIN] Cobra",
		"room": 48274
	},
	"22066825": {
		"accountid": 22066825,
		"name": "REKT-IT-RALPH™",
		"prefix": "[YOWH]",
		"room": 49050
	},
};

var baseURL = 'http://steamapi-a.akamaihd.net/ITowerAttackMiniGameService/GetPlayerNames/v0001/?gameid=';
var statusURL = 'http://steamapi-a.akamaihd.net/ITowerAttackMiniGameService/GetGameData/v0001/?gameid=';

var getNames = function(roomID, instance, step, cb, externalCb) {
	cb = cb || function(){};
	externalCb = externalCb || function(){};
	http.get(baseURL + roomID, function(res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function() {
			try {
				data = JSON.parse(data);
			} catch (err) {
				setTimeout(function() {
					getNames(roomID, instance, step, cb, externalCb);
				}, 2000);
				return;
			}
			if (isEmptyObject(data.response)) {
				//console.log('empty room');
				checkStatus(roomID);
				cb(lowestRoom + instance, instance, step, externalCb);
			} else {
				data = data.response.names;
				data.forEach(function(val) {
					if (msgUsers[val.accountid] != undefined && msgUsers[val.accountid].room != roomID) {
						msgUsers[val.accountid].room = roomID;
						msgUsers[val.accountid].date = new Date();
						msgUsers[val.accountid].name = val.name;
						console.log('Found user '+ val.name +' in room '+ roomID);
						externalCb(msgUsers[val.accountid]);
					}
				});
				cb(roomID + step, instance, step, externalCb);
			}
		});
		//console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		setTimeout(function() {
			getNames(roomID, instance, step, cb, externalCb);
		}, 2000);
	});
};

var checkStatus = function(roomID, cb) {
	cb = cb || function(){};
	//console.log('checking '+ roomID)
	http.get(statusURL + roomID, function(res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function() {
			try {
				data = JSON.parse(data);
			} catch (err) {
				setTimeout(function() {
					checkStatus(roomID, cb);
				}, 2000);
				return;
			}
			if (isEmptyObject(data.response)) {

			} else {
				data = data.response.game_data.status;
				//console.log(data);
				if (data > 2) {
					if (roomID > lowestRoom) {
						lowestRoom = roomID + 1;
						console.log('updated lowestRoom = '+ lowestRoom);
					}
				}
			}
		});
		//console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		setTimeout(function() {
			checkStatus(roomID, cb);
		}, 2000);
	});
};

var next = function(nextRoomID, instance, step, cb) {
	if (nextRoomID < lowestRoom + instance) {
		nextRoomID = lowestRoom + instance;
	}
	/*if (nextRoomID % 50 == 0)
		console.log('getting room '+ nextRoomID);*/
	setTimeout(function() {
		getNames(nextRoomID, instance, step, next, cb);
	}, 2000);
};

module.exports = function(cb, instances) {
	cb = cb || function(){};
	instances = instances || 50;
	var i = 0;
	while (i < instances) {
		next(lowestRoom + i, i, instances, cb);
		i++;	
	}

	return {getUsers: function() {
		return msgUsers;
	},
	getLowestRoom: function() {
		return lowestRoom;
	}};
};
