/* All my javascript backend */
/* Using API 0.1 because screw 2.0 its hard */
/* Wait jk lol I win */




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
    
     function loadDevices(offset){
    	//request to get the list of "categories"
    	var devReq = new Request({
			url: 'https://www.ifixit.com/api/2.0/categories/all?limit=' + limit + '&offset=' + offset,
			callbackKey: 'reqInfo',
			onRequest: function(url){
				
				// a script tag is created with a src attribute equal to url
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
		rangeDisplay.textContent = 'Showing ' + strRangeBeg + '-' + strRangeEnd + ' out out of 55555';
		rangeDisplay.id = 'range';
		rangeDisplay.inject('rangeBar');
		
		
    }
    window.addEvent('domready', function() {
    			
    			//alert('The DOM is ready!');
    			// Do some stuff
    			
    			sqlDB.addEvent('notSupported', function(){
    				console.log("Sorry, but the Gearbag feature does not work with your browser. Go download Chrome.");
    			});
    			sqlDB.addEvent('databaseCreated', function(){
    				alert('Created.');
    			});
    			
    			//scrapeDB();
    			loadDevices();
    			
    			

    }); //End of window event
    // End of loadDevices()			
	function printArray(array, size){
		for(var i=0; i<size; i++){
			console.log(array[i]);
		}
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
		addDrag(option);
		
		//Add events section
		option.addEvent('mouseover', function(){
			var displayName = new Element('p');
			displayName.id = 'name';
			displayName.textContent = name;
			displayName.inject('name-bar');
			
		});
		option.addEvent('mouseleave', function(){
			var el = document.getElementById('name');
			el.destroy();

		});
		
		
		option.inject("devices");
		
		
		//addItemToTable(option);
		
		
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
				
				// a script tag is created with a src attribute equal to url
			},
			onComplete: function(data){
				var imgTag;
				console.log(data);
				var device = JSON.parse(data);
				//console.log(device.image);
				if (device.image == null) imgTag = 'noimg.png';
				else imgTag = device.image.thumbnail;
				//Got the image url, now insert it into the page
				createDevice(devName, imgTag, displayNum);
			
			}
			
		}).get(data);
	}
	// create the table for the gearbag devices
	/*function checkDatabase(){
		sqDB.tableExists('devTable', function(){
		});
	}*/
	/*create: function(table, values, callback) {
    	var valuesmap;
    	valuesmap = new Hash(values).map(function(value, key) {
      	return '"' + key + '" ' + $splat(value).join(" ").toUpperCase();
    });
    values = $splat(valuesmap.getValues()).join(', ');
    return this.exec("CREATE TABLE '" + (table) + "' ( " + (values) + " )", callback);
  },*/
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
		rangeBeg+=limit;
		rangeEnd+=limit;
		offset+=limit;
		updateRange();
		emptyContainer();
		loadDevices(offset);	
	}
	
	function updateRange(){
		var element = document.getElementById('range');
		element.destroy();
		/*var strRangeBeg = rangeBeg.toString();
		var strRangeEnd = rangeEnd.toString();
		var rangeDisplay = new Element('p');
		rangeDisplay.textContent = 'Showing ' + strRangeBeg + '-' + strRangeEnd + ' out out of 55555';
		rangeDisplay.id = 'range';
		rangeDisplay.inject('rangeBar');*/

	}
	
	
	/* Drag and Drop Stuff */
	function addDrag(item){
		
		var itemClone = item.clone().cloneEvents(item);
	
	
		var myDrag = new Drag.Move(itemClone, {
 
    		droppables: 'myDevices',
 
    		onDrop: function(element, droppable, event){
        		if (!droppable) console.log(element, ' dropped on nothing');
        		else console.log(element, 'dropped on', droppable, 'event', event);
        		addItemToDB(item);
    		},
    		onCancel: function(dragging){
				dragging.destroy();
			}
		});
	}
	
	function addItemToDB(item){
		item.inject('myDevices');
	
	
	}
	
	function emptyContainer(){
		/*var elementList = document.getElementsByClassName('device-box');
		
		*/
		var element = document.getElementById("devices");
		while (element.hasChildNodes()){
  			element.removeChild(element.lastChild);
  		}
		/*var devNodes = devNodes.childNodes; 
		
		for(var i=0; i<devNodes.length; i++){
			var el = devNodes[i];
			
			if(el.tagName == 'IMG') el.destroy();
			
		}
		//injectSlots();
		var newNodes = document.getElementById("devices");
		var newNodes = newNodes.childNodes; 
		console.log(newNodes);*/
		
		
	}
	
	
	function injectSlots(){
		for(var r = 0; r<5; r++){
			for(var c=0; c<8; c++){
				var slot = new Element('div');
				var strR = r.toString();
				var strC = c.toString();
				slot.id = 'slot' + strR + '-' + strC;
				slot.class = 'device-box';
			}
		
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





