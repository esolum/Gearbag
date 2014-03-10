/* All my javascript backend */
/* Can't figure out why the TypeMistmatch Error keeps popping up with moosql.js */

{
	var offset = 0;
    var limit = 25;
    var data;
    var rangeBeg = 1;
    var rangeEnd = 25;
    
    var devNames = new Array();
	var sqlDB = new MooSQL({
        	//Database name
        	dbName:'Gearbag',
        	
        	//Database version (max 4 numbers seperated by dots)
        	dbVersion:'1.0',
        
        	//Database description (officially database display name)
        	dbDesc:'This is a gearbag database',
        	
        	//Estimated size
        	dbSize:20*100
    });
    
    window.addEvent('domready', function() {
    			
    			sqlDB.addEvent('notSupported', function(){
    				console.log("Sorry, but the Gearbag feature does not work with your browser. Go download Chrome.");
    			});
    			sqlDB.addEvent('databaseCreated', function(){
    				alert('Created.');
    			});
    			// add check function to see if table is created or not
    			checkDB();
    			loadDevices();
    });
    
    function loadDevices(offset){
    	//request to get the list of "categories"
    	var devReq = new Request({
			url: 'https://www.ifixit.com/api/2.0/categories/all?limit=' + limit + '&offset=' + offset,
			callbackKey: 'reqInfo',
			onRequest: function(url){
			
			},
			onFailure: function(){
				console.log("Failed to complete request.");
			},
			onComplete: function(data){
				
				data = data.substr(1, data.length-2); //remove brackets
				
				data = data.split(',');
				
				for(var i=0; i<data.length; i++)
				{
					getImage(data[i], i);
				}
			}
		}).get(data);
		
		/*     Range Bar Display     */
		var rangeDisplay = new Element('p');
		var strRangeBeg = rangeBeg.toString();
		var strRangeEnd = rangeEnd.toString();
		rangeDisplay.textContent = 'Showing ' + strRangeBeg + '-' + strRangeEnd + ' out out of 2788';
		rangeDisplay.id = 'range';
		rangeDisplay.inject('rangeBar');
	}	
    		
	function createDevice(name, imgTag, displayNum){
		name = name.replace('"', '');
		name = name.replace('"', '');
		name = name.replace("\\", '');
		var option = new Element('img');
		option.src = imgTag;
		if(imgTag == null) option.src = 'noimg.png';
		option.margin = '10px';
		option.class = 'device-box';
		option.display = 'inline';
		option.cursor = 'pointer';
		addDrag(option, name);
		
		//Adding events to option
		option.addEvent('mouseover', function(){
			if(document.getElementById('name')==null) {
				var displayName = new Element('p');
				displayName.id = 'name';
				displayName.textContent = name;
				displayName.inject('name-bar');
			}
		});
		option.addEvent('mouseleave', function(){
			var el = document.getElementById('name');
			if(el!=null) el.destroy();

		});	
		option.inject("devices");	
	}
	
	function createURL(nameString){
		var nameArray = nameString.split(' ');
		var urlName = nameArray.join('_');
		var urlName = urlName.replace("\\", '');
		urlName = urlName.substr(1, urlName.length-2);
		return urlName;		
	}
	
	function getImage(name, displayNum){
		var devName = name;
		name = createURL(name);
		var imageReq = new Request({
			url: 'https://www.ifixit.com/api/2.0/categories/' + name,
			callbackKey: 'reqInfo',
			onRequest: function(url){
			
			},
			onComplete: function(data){
				var imgTag;
				var device = JSON.parse(data);
				if (device.image == null) imgTag = 'noimg.png';
				else imgTag = device.image.thumbnail;
				createDevice(devName, imgTag, displayNum);
			}
		}).get(data);
	}
	
	function prevDevices(){
		if(rangeBeg > 1) {
			rangeBeg-=limit;
			rangeEnd-=limit;
			offset-=limit;
			updateRange();
			emptyContainer();
			loadDevices(offset);
		}
	}
	
	function nextDevices(){
		if(rangeEnd < 2788){
			rangeBeg+=limit;
			rangeEnd+=limit;
			offset+=limit;
			updateRange();
			emptyContainer();
			loadDevices(offset);
		}	
	}
	
	function updateRange(){
		var element = document.getElementById('range');
		element.destroy();
	}
	
	
	/* Drag and Drop Stuff */
	function addDrag(item, name){
		item.addEvent('mousedown', function(event){
			event.stop();

			// `this` refers to the element with the .item class
			var myDevice = this;

			//put the clone in the same place as the device to be injectes
			var itemClone = myDevice.clone().setStyles(myDevice.getCoordinates()).setStyles({
				opacity: 0.8,
				position: 'absolute'
			}).inject(document.body);
		
	
			var myDrag = new Drag.Move(itemClone, {
 
    			droppables: document.getElementById('myDevices'),
 
    			onDrop: function(dragging, location){
        			dragging.destroy();
        			if (location != null){
          				myDevice.inject(location);
          		
          				if(location == document.getElementById('myDevices')){
          					//insertDB(gear.innerText, gear.style.backgroundImage);
          					console.log("Need to figure this out");
          					//Destroy the connection that displays the name on rollover
          					var el = document.getElementById('name');
							if(el != null) el.destroy();
          				}
          				// if the destination is the items pane, remove it from the database
          				if(location != document.getElementById('myDevices')){
          					//removeDB(myDevice.innerText);
          					console.log("Figure out what this does too.");
          					//Destroy rollover name element
          					var el = document.getElementById('name');
							if(el != null) el.destroy();
          				}
        			}
        			else{ }
      			},
    			onCancel: function(dragging){
					dragging.destroy();
					var el = document.getElementById('name');
					if(el != null) el.destroy();
				}
			});
		myDrag.start(event);
		});
		
	}
	
	/* SQL Storage */
	function checkDB(){
		sqlDB.tableExists('gearbag', {run: function(transaction, result){
			createTable();
		}});
	}
	
	function createTable(){
		sqlDB.exec("CREATE TABLE gearbag(deviceName varchar(255), imgURL varchar(255))", function(transaction, result){
		});
	}
	
	function dbInsert(device){
		device.inject('myDevices');

		//var insert = "INSERT INTO gearbag (deviceName, imgURL) VALUES (?, ?)";
			
		sqlDB.insert('gearbag', [device.name, device.imgTag], onError);
			
	}
	
	function dbDelete(device){
		var remove = "DELETE FROM gearbag WHERE deviceName=?";
		sqlDB.transaction(function(tx) {
			tx.executeSql(remove, [device.name], showRecords, onError);
		});
		
	}
	
	
	
	function showRecords() {
		var selectAllStatement = "SELECT * FROM gearbag "; 
		results.innerHTML = '';
		db.transaction(function(tx) {
			tx.executeSql(selectAllStatement, [], function(tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					results.innerHTML += '<li>' + item['itemName'] + ' , ' + item['url'] + ' <a href="#" onclick="loadRecord('+i+')">edit</a>  ' + '<a href="#" onclick="deleteRecord('+item['id']+')">delete</a></li>';
				}
			});
		});
	}
	function onError(tx, error){
		alert(error.message);
	}
	
	function emptyContainer(){
		var element = document.getElementById("devices");
		while (element.hasChildNodes()){
  			element.removeChild(element.lastChild);
  		}
	}
}


/* FUTURE STUFF */

/*
	Create the table that will store all the devices
	Add each device to the table
	
	Implement Drag and Drop
	Add a search element
	Add hover events to say name of device on a bar above devices
		Fire mouseenter and mouseleave to remove injection of name 
	

*/





