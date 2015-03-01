/**
 *
 * Hackenstance
 *
 */
//Initial setup
var UI = require('ui');
var selectedGroups = [];
var ajax = require('ajax');

var matchCard = new UI.Card({
	title: "A match has been found!"
});

//Poll for nearby on accel
function accelPoll() {
	var Accel = require('ui/accel');
	Accel.init();
	Accel.on('tap', function(e) {
		var Vibe = require('ui/vibe');
		Vibe.vibrate('double');
		//var Light = require('ui/light');
		//Light.on('long');
		//if(e.axis.y) {
			console.log('match');
			matchCard.show();
			locationCard.hide();
			/*ajax({
    		  	url: 'https://hackenstance.firebaseio.com/users/2/groups.json',
    			type: 'json',
    			method: 'post',
    			data: groupObject
  			}, function(data, status, request) {
    			console.log(data.toString());
  			}, function(error, status, request) {
    			console.log('The ajax request failed: ' + error);
  			});
			*/
		//}
	});
}
//end poll


//Location!
function location() {
  var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  ajax({
    url: 'https://hackenstance.firebaseio.com/users/2/location.json',
    type: 'json',
    method: 'put',
    data: {location: pos}
  },
  function(data, status, request) {
    console.log(data.toString());
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

// Make an asynchronous request
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
}
//End location

var locationCard = new UI.Card({
  title: "Hackenstance is running!",
  body: "We'll let you know if there is anyone nearby!"
});

var menu = new UI.Menu(
{
    sections: [{
        title: "groups",
        items: [{
            title: "HackIllinois 2015 Attendees"
        }, {
            title: "Awesome Board Game Group"
        }, {
            title: "Ladies Storm Hackathons"
        }, {
            title: "HH Design"
        }, {
            title: "HH MHacks"
        }, {
            title: "Hackcon"
        }, {
            title: "Anime UC"
        }, {
            title: "HH Throw a Hackathon"
        }, {
            title: "Parallel Computing Class"
        }, {
            title: "Bearcat LaunchPad 2014"
        }, {
            title: "Women In IT (WIT) Student group - University of Cincinnati"
        }, {
            title: "Hackathon Hackers"
        }, {
            title: "Tabletop Gaming"
        }, {
            title: "CEAS Ambassadors"
        }, {
            title: "Bearcat Hackers"
        }, {
            title: "UC Robotics Team: 3-D Modeling Team"
        }, {
            title: "OSU Starbucks"
        }, {
            title: "Computer Science Class of 2016"
        }, {
            title: "New York 2013"
        }, {
            title: "LaRC@UC"
        }, {
            title: "ACM Executive Board"
        }, {
            title: "UC Robotics Team"
        }, {
            title: "Howard Family"
        }, {
            title: "Fantasy Football 8 Man War"
        }, {
            title: "ACM@uc"
        }, {
            title: "Computer Science"
        }, {
            title: "Cincinnati"
        }, {
            title: "Computer Science Learning Community"
        }, {
            title: "Computer Science Class of 2016"
        }, {
            title: "UAHS Class of 2007 5-year Reunion"
        }, {
            title: "LFG any dungeon"
        }, {
            title: "Done"
        }]
    }]
});

//Send dataz to firebase
function sendIsFirst(boolThing, groupObject) {
ajax({
    url: 'https://hackenstance.firebaseio.com/users/2/isFirst.json',
    type: 'json',
    method: 'put',
    data: {isFirst: false}
  },
  function(data, status, request) {
    console.log(data.toString());
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);
  
  ajax({
    url: 'https://hackenstance.firebaseio.com/users/2/groups.json',
    type: 'json',
    method: 'post',
    data: groupObject
  }, function(data, status, request) {
    console.log(data.toString());
  }, function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  });
}

//Menu selector
menu.on('select', function(menuItem) {
  if(menuItem.item.title === 'Done') {
    locationCard.show();
    menu.hide();
    //send groups to firebase
    sendIsFirst(false, selectedGroups);
    //start sending location data
    location();
		accelPoll();
  } else {
    selectedGroups.push({
      title: menuItem.item.title
    });
    console.log(menuItem.item.title);
  }
});
//End initial setup

//Loading screen
ajax({
    url: 'https://hackenstance.firebaseio.com/users/2/isFirst.json',
    type: 'json'
  },
  function(data, status, request) {
    //check if user has selected their groups
    if(data.isFirst) {
      menu.show();
    } else {
    //start sending location data
    	location();
   	locationCard.show();
		accelPoll();
    }
    console.log(data.isFirst);
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);
//End loading screen