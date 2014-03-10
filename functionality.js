/* All my javascript backend */
/* Everything works! */

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
    			
    			// add check function to see if table is created or not
    			checkDB();
    			loadDevices();
    			sqlDB.addEvent('databaseCreated', function(){
    				
    			});
    });
    
    function loadDevices(offset){
    	//request to get the list of "categories"
    	var devReq = new Request({
			url: 'https://www.ifixit.com/api/2.0/categories/all?limit=' + limit + '&offset=' + offset,
			callbackKey: 'reqInfo',
			onRequest: function(url){},
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
		rangeDisplay.textContent = 'Showing ' + strRangeBeg + '-' + strRangeEnd + ' out of 2788';
		rangeDisplay.id = 'range';
		rangeDisplay.inject('rangeBar');
	}	
    		
	function createDevice(name, imgTag, displayNum){
		name = name.replace('"', '');
		name = name.replace('"', '');
		name = name.replace("\\", '');
		var option = new Element('img');
		option.src = imgTag;
		if(imgTag == null) option.src = 'http://users.csc.calpoly.edu/~esolum/noimg.png';
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
			onRequest: function(url){},
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

			//Enables you to drag a clone over without deleting the item in the Device List
			var myDevice = this.clone().cloneEvents(this);
			var itemClone = this.clone().setStyles(this.getCoordinates()).setStyles({
				opacity: 0.8,
				position: 'absolute'
			}).inject(document.body);
		
			/* Draggin' and Droppin' */
			var myDrag = new Drag.Move(itemClone, {
 
    			droppables: document.getElementById('myDevices'),
 
    			onDrop: function(dragging, location){
        			dragging.destroy(); // destroy the translucent clone
        			if (location != null){
          				if(location == document.getElementById('myDevices')){
          					insertNewDevice(name, myDevice.src);
          					
          					//Destroy the connection that displays the name on rollover
          					var el = document.getElementById('name');
							if(el != null) el.destroy();
          				}
        			}
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

    	sqlDB.tableExists('gearbag', function(transaction, result){
			createTable(); // create gearbag if callback function is run
		});
		
		//Display anything that was previously in the database
    	sqlDB.exec("SELECT * FROM gearbag", function (transaction,result){
    	  for(var i=0; i < result.rows.length; i++){
		 	displayMyDevice(result.rows.item(i)['name'], result.rows.item(i)['img']);
      	  } 
    	});
	}
	
	function createTable(){
		// make the table if it's not there
		sqlDB.exec("CREATE TABLE gearbag(name varchar(255), img varchar(255))", function(transaction, result){});
	}	
	
	function insertNewDevice(name, img){
		sqlDB.exec("INSERT INTO gearbag (name, img) VALUES ('"+ name +"','"+ img +"')", function(transaction, result){});
		displayMyDevice(name, img);
	}
	
	function removeDevice(device){
		// remove an item from the table
		sqlDB.exec("DELETE FROM gearbag WHERE name='"+device+"'", function(transaction, result){});
	}
	
	function displayMyDevice(name, imgTag){
		// to make an item in the bag (from the database)
		var option = new Element('img');
		option.src = imgTag;
		option.id = name;
		option.margin = '10px';
		option.class = 'device-box';
		option.display = 'inline';
		option.cursor = 'pointer';
		
		/* Add Gearbag-specific device events */
		
		/* If the user clicks on a device in the Gearbag it will be deleted from the database */
		option.addEvent('mousedown', function(){
			removeDevice(name);
			var el = document.getElementById(name);
			el.destroy();
		});

		option.inject('myDevices');
	}
	
	function emptyContainer(){
		var element = document.getElementById("devices");
		while (element.hasChildNodes()){
  			element.removeChild(element.lastChild);
  		}
	}
} 





