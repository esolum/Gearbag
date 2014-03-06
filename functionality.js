/* All my javascript backend */
/* Using API 0.1 because screw 2.0 its hard */
/* Wait jk lol I win */
{
	var offset = 0;
    var limit = 20;
    var data; 
    
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
    
     function loadDevices(){
    	//request to get the list of "categories"
    	var devReq = new Request({
			url: 'https://www.ifixit.com/api/2.0/categories/all?limit=32&offset=0',
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
					
					var imageTag= getImage(data[i], i);
					
				}
				
			
			}
			
		}).get(data);
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
    			
    			
    			loadDevices();
    			
    			

    }); //End of window event
    // End of loadDevices()			
	function printArray(array, size){
		for(var i=0; i<size; i++){
			console.log(array[i]);
		}
	}		 
	
	function createDevice(name, imgTag, displayNum){
		
		
		var option = new Element('img');
		option.src = imgTag;
		option.margin = '10px';
		option.class = 'device-column';
		option.display = 'inline';
		if(displayNum < 7) option.inject('column1');
		else if(displayNum >= 7 && displayNum< 13) option.inject('column2');
		else if(displayNum >= 13 && displayNum<19 ) option.inject('column3');
		else if(displayNum >= 19 && displayNum<25 ) option.inject('column4');
		else if(displayNum >= 25 && displayNum<35 ) option.inject('column5');
		
	}
	
	function createURL(nameString){
		var nameArray = nameString.split(' ');
		var urlName = nameArray.join('_');

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
				
				var device = JSON.parse(data);
				var imgTag = device.image.thumbnail;
				//if(stuff.image != null) console.log(stuff.image.thumbnail);
				
				//Got the image url, now insert it into the page
				createDevice(devName, imgTag, displayNum);
			
			}
			
		}).get(data);
	}
	
	

}


/* FUTURE STUFF */

/*
	Create the table that will store all the devices
	Add each device to the table
	Nix the next and previous buttons and implement a scroller or something instead
	Add a search element

*/





