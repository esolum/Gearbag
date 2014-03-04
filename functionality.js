/* All my javascript backend */
/* Using API 0.1 because screw 2.0 its hard */
/* Wait jk lol I win */
{
	var offset = 0;
    var limit = 20;
    var data;
    var arr;
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
    function loadDevices(){
    	
    	var devReq = new Request({
			url: 'https://www.ifixit.com/api/2.0/categories/all',
			callbackKey: 'reqInfo',
			onRequest: function(url){
				
				// a script tag is created with a src attribute equal to url
			},
			onComplete: function(data){
				arr = data.split(",");
				var i=0;
    			while(i<20){
    				console.log(arr[i]);
    				i++;
    			}
			}
			
		}).get(data);
    } // End of loadDevices()			
	function printArray(array, size){
		for(var i=0; i<size; i++){
			console.log(array[i]);
		}
	}		 
	
	/* Trigger stuff to happen if errors pop up */
	
	
	
	
	
	
	
	//make an item 
	/*function makeItem(name, image){
		var item = new Element('div'){
			class: 'item',
			}
		}
	}*/
	
	

}


/* STUBS   -   FUTURE STUFF */

//addDevice()






