var http = require('http');

var lowestRoom = 44347;

var isEmptyObject = function(obj) {
  return !Object.keys(obj).length;
}

var msgUsers = {
	11662973: {
		"accountid": 11662973,
		"name": "[MSG15 MOD] desolation",
		"room": 43983
	},
	89051843: {
		"accountid": 89051843,
		"name": "[MSG15 ADMIN] /u/wchill",
		"room": 43983
	},
	28974871: {
		"accountid": 28974871,
		"name": "[MSG15 ADMIN] xᴄᴀᴠᴀ86x ☂",
		"room": 43983
	},
	446489: {
		"accountid": 446489,
		"name": "[MSG15 FAN] Trouvist",
		"room": 43983
	},
	45800824: {
		"accountid": 45800824,
		"name": "[MSG15 MOD] Mithriael",
		"room": 43983
	},
	10098050: {
		"accountid": 10098050,
		"name": "[MSG15 ADMIN] Mr. uLLeticaL™",
		"room": 43983
	},
	2565066: {
		"accountid": 2565066,
		"name": "[MSG15 MOD] Pawsed",
		"room": 44215
	},
	6905879: {
		"accountid": 6905879,
		"name": "[MSG15 MOD] iddqd",
		"room": 44215
	},
	69178454: {
		"accountid": 69178454,
		"name": "[MSG15 MOD] rhythm girl",
		"room": 44215
	},
	79519465: {
		"accountid": 79519465,
		"name": "[MSG15 ADMIN] Soragnamdan Ѳ空",
		"room": 44215
	},
	111470985: {
		"accountid": 111470985,
		"name": "[MSG15 BOT]SoraBot",
		"room": 44215
	},
	9727743: {
		"accountid": 9727743,
		"name": "[MSG15 ADMIN] Cobra",
		"room": 44215
	},
	59119854: {
		"accountid": 59119854,
		"name": "[MSG15 MOD] alicia ws@d",
		"room": 44215
	},
	133090071: {
		"accountid": 133090071,
		"name": "[MSG15 ADMIN]Mrs. uLLeticaL™",
		"room": 44215
	},
	8520498: {
		"accountid": 8520498,
		"name": "[MSG15 ADMIN] Minz",
		"room": 44215
	},
};

var baseURL = 'http://steamapi-a.akamaihd.net/ITowerAttackMiniGameService/GetPlayerNames/v0001/?gameid=';
var statusURL = 'http://steamapi-a.akamaihd.net/ITowerAttackMiniGameService/GetGameData/v0001/?gameid=';

var getNames = function(roomID, instance, step, cb) {
	cb = cb || function(){};
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
					getNames(roomID, instance, step, cb);
				}, 1000);
				return;
			}
			if (isEmptyObject(data.response)) {
				//console.log('empty room');
				checkStatus(roomID);
				cb(lowestRoom + instance, instance, step);
			} else {
				data = data.response.names;
				data.forEach(function(val) {
					if (msgUsers[val.accountid] != undefined && msgUsers[val.accountid].room != roomID) {
						msgUsers[val.accountid].room = roomID;
						console.log('Found user '+ val.name +' in room '+ roomID);
					}
				});
				cb(roomID + step, instance, step);
			}
		});
		//console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
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
			data = JSON.parse(data);
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
	});
};

var next = function(nextRoomID, instance, step) {
	if (nextRoomID < lowestRoom + instance) {
		nextRoomID = lowestRoom + instance;
	}
	/*if (nextRoomID % 50 == 0)
		console.log('getting room '+ nextRoomID);*/
	setTimeout(function() {
		getNames(nextRoomID, instance, step, next);
	}, 1000);
};

var instances = 50;
var i = 0;
while (i < instances) {
	next(lowestRoom + i, i, instances);
	i++;	
}
