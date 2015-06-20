var http = require('http');

var lowestRoom = 46902;

var isEmptyObject = function(obj) {
  return !Object.keys(obj).length;
}

var msgUsers = {
	"9727743": {
		"date": "2015-06-20T10:33:14.207Z",
		"accountid": 9727743,
		"room": 47051,
		"name": "[MSG15 ADMIN] Cobra"
	},
	"59119854": {
		"date": "2015-06-20T10:46:12.034Z",
		"accountid": 59119854,
		"room": 47100,
		"name": "[MSG15 MOD] alicia ws@d"
	},
	"2565066": {
		"date": "2015-06-20T10:33:12.383Z",
		"accountid": 2565066,
		"room": 47090,
		"name": "[MSG15 MOD] Pawsed"
	},
	"45800824": {
		"date": "2015-06-20T10:33:37.776Z",
		"accountid": 45800824,
		"room": 47693,
		"name": "[MSG15 MOD] Mithriael"
	},
	"69178454": {
		"date": "2015-06-20T14:29:32.883Z",
		"accountid": 69178454,
		"room": 47693,
		"name": "[MSG15 MOD] rhythm girl"
	},
	"10098050": {
		"date": "2015-06-20T10:33:37.776Z",
		"accountid": 10098050,
		"room": 47693,
		"name": "[MSG15 ADMIN] Mr. uLLeticaL\u2122"
	},
	"28974871": {
		"date": "2015-06-20T10:33:46.592Z",
		"accountid": 28974871,
		"room": 47770,
		"name": "[MSG15 ADMIN] x\u1d04\u1d00\u1d20\u1d0086x \u2602"
	},
	"11662973": {
		"date": "2015-06-20T14:37:32.510Z",
		"accountid": 11662973,
		"room": 47200,
		"name": "[MSG15 MOD] desolation"
	},
	"89051843": {
		"date": "2015-06-20T10:33:12.484Z",
		"accountid": 89051843,
		"room": 47091,
		"name": "[MSG15 ADMIN] /u/wchill"
	},
	"6905879": {
		"date": "2015-06-20T11:58:22.100Z",
		"accountid": 6905879,
		"room": 47770,
		"name": "[MSG15 MOD] iddqd"
	},
	"446489": {
		"date": "2015-06-20T10:33:12.365Z",
		"accountid": 446489,
		"room": 47090,
		"name": "[MSG15 FAN] Trouvist"
	},
	"8520498": {
		"date": "2015-06-20T10:33:37.769Z",
		"accountid": 8520498,
		"room": 47693,
		"name": "[MSG15 ADMIN] Minz"
	},
	"133090071": {
		"date": "2015-06-20T10:33:46.588Z",
		"accountid": 133090071,
		"room": 47770,
		"name": "[MSG15 ADMIN]Mrs. uLLeticaL\u2122"
	},
	"79519465": {
		"date": "2015-06-20T10:33:39.287Z",
		"accountid": 79519465,
		"room": 47634,
		"name": "[MSG15 ADMIN] Soragnamdan \u0472\u7a7a"
	}
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
