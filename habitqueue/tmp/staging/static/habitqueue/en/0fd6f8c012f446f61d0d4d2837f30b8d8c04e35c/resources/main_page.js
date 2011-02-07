// ==========================================================================
// Project:   Habitqueue - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */

Habitqueue.iconsPage = SC.Page.create({
  
  mainView: SC.LabelView.design({
    escapeHTML: NO,
    classNames: 'composition-monitor',
    value: function() {  
      
		var k='alert';
		var iconSize=48;
		var ret='<div class="icon"><div class="inner"><img src="%@" class="icon sc-icon-%@-%@" style="height: %@px; width: %@px; position: relative" /></div><label>sc-icon-%@-%@</label></div>'.fmt('/static/sproutcore/foundation/en/760e3e0dd716bca963274213a64ff4ff49ea4636/blank.gif', k, iconSize, iconSize, iconSize, k, iconSize);
		return ret+ret+ret;
    }()
  })

});

Habitqueue.compositionChart = SC.Page.create({
  mainView: SC.LabelView.design({
    escapeHTML: NO,
    classNames: 'composition-monitor',
	value: '<h3>This is who you are</h3><div id="visualization">NOTHING IS HAPPENING WTF</div>',
	didFetchTasks: function(response, store, query) {
	  					  if(SC.ok(response)) {
	  					    var body = response.get('encodedBody');
	  					    var couchResponse = SC.json.decode(body);
	  					    var records = couchResponse.rows.getEach('value');
	  						console.log(records);
	  					    store.loadRecords(Habitqueue.Task, records);
	  					    store.dataSourceDidFetchQuery(query);
	  					 } else {
	  					    store.dataSourceDidErrorQuery(query, response);
	  					 }
	 },
	didAppendToDocument: function(){ 
	        this.initChart(); 
	},
    initChart: function () { 
    	var canvasId = "visualization";

         var data = new google.visualization.DataTable(); 

                data.addColumn('string', 'lifelet'); 

                data.addColumn('number', 'percent'); 
					// //////////HAAAAAAAAAAAAAAAAAAAACK //fix this tomorrow
					// // instantiate a new XMLHttpRequest object
					// var req = new XMLHttpRequest()
					// // Open a GET request to "/all_dbs"
					// req.open("GET", "http://spreelanka.couchone.com/habitqueue/_design/app/_view/tagSum")
					// // Send nothing as the request body
					// req.send("")
					// // Get the response
					// console.log(req.responseText);
					var hk = SC.Request.getUrl("http://spreelanka.couchone.com/habitqueue/_design/app/_view/tagSum");
//					.header('Accept', 'application/json')
//					.json();//.get('body').content;
					console.log(hk);
//					["some_database", "another_database"]
				          //SC.Request.getUrl("spreelanka.couchone.com/habitqueue/_design/app/_view/allTasks").json();

					//////////
                data.addRows([ 
                  ['January',{v:20, f:'$20M'}], 
                  ['February',{v:31, f:'$31M'}], 
                  ['March',{v:61, f:'$61M'}], 
                  ['April',{v:26, f:'$26M'}] 
                ]); 
// console.log(document.getElementById(canvasId));
// 				console.log("bout to return");
// 				return "not much";
                // Create and draw the visualization. 
				var ele=document.getElementById(canvasId);
				if(ele){
	                new google.visualization.PieChart( 
	                  ele). 
	                    draw(data, {is3D:true}); 
				}
				
  			}
	})
});


// SC.View.extend({ 
//   didAppendToDocument: function(){ 
//         this.initChart(); 
//   }, 
//   initChart: function () { 
//     var canvasId = this.get("layerId"); 
//          var data = new google.visualization.DataTable(); 
//                 data.addColumn('string', 'Month'); 
//                 data.addColumn('number', 'Sales'); 
//                 data.addRows([ 
//                   ['January',{v:20, f:'$20M'}], 
//                   ['February',{v:31, f:'$31M'}], 
//                   ['March',{v:61, f:'$61M'}], 
//                   ['April',{v:26, f:'$26M'}] 
//                 ]); 
//                 // Create and draw the visualization. 
//                 new google.visualization.PieChart( 
//                   document.getElementById(canvasId)). 
//                     draw(data, {is3D:true}); 
//   } 
// }).create;







// This page describes the main user interface for your application.  
Habitqueue.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
	childViews: 'middleView topView bottomView'.w(),

	    topView: SC.ToolbarView.design({
	      layout: { top: 0, left: 0, right: 0, height: 36 },
	      childViews: 'labelView addButton'.w(),
	      anchorLocation: SC.ANCHOR_TOP,
	
			labelView: SC.LabelView.design({
		        layout: { centerY: 0, height: 24, left: 8, width: 200 },
		        controlSize: SC.LARGE_CONTROL_SIZE,
		        fontWeight: SC.BOLD_WEIGHT,
		        value:   'Habitqueue'
		      }),

		      addButton: SC.ButtonView.design({
		        layout: { centerY: 0, height: 24, right: 12, width: 100 },
		        title:  "Add Task",
				target: "Habitqueue.tasksController",
				action: "addTask"
		      })

	    }),
		middleView: SC.ScrollView.design({
		 	      hasHorizontalScroller: NO,
		 	      layout: { top: 36, bottom: 32, left: 0, right: 0 },
		 	      backgroundColor: 'white',
		 
		 	      contentView: SC.SplitView.design({
			        layout: { top: 0, left: 0, bottom: 0, right: 0 },
					layoutDirection: SC.LAYOUT_HORIZONTAL,
					autoresizeBehavior: SC.RESIZE_TOP_LEFT,

					defaultThickness: 0.5,
//			        childViews: 'descriptionView tagView'.w(),

			        topLeftView:SC.SplitView.design({
			          layout: { left: 0, top: 70, right: 0, bottom: 0 },
			          layoutDirection: SC.LAYOUT_HORIZONTAL,
						topLeftView: SC.ListView.design({
				 			contentBinding: 'Habitqueue.tasksController.arrangedObjects',
				 			selectionBinding: 'Habitqueue.tasksController.selection',
				 			contentValueKey: "description",
				 			contentCheckboxKey: "isDone",
				 			rowHeight: 21,
				 			canEditContent: YES,
				 			canDeleteContent: YES,
				 			target: "Habitqueue.tasksController",
				 			action: "toggleDone"
				 	      }),

				        bottomRightView: SC.ListView.design({
				 			contentBinding: 'Habitqueue.tasksController.arrangedObjects',
				 			selectionBinding: 'Habitqueue.tasksController.selection',
				 			contentValueKey: "tag",
	//			 			contentCheckboxKey: "isDone",
				 			rowHeight: 21,
				 			canEditContent: YES,
				 			canDeleteContent: YES,
				 			target: "Habitqueue.tasksController",
				 			action: "toggleDone"
				 	      })
					}),
					bottomRightView: Habitqueue.compositionChart.mainView
				})
					
			
		 	}),
			
////working original listview		
				// middleView: SC.ScrollView.design({
				//  	      hasHorizontalScroller: NO,
				//  	      layout: { top: 36, bottom: 32, left: 0, right: 0 },
				//  	      backgroundColor: 'white',
				// 
				//  	      contentView: SC.ListView.design({
				//  			contentBinding: 'Habitqueue.tasksController.arrangedObjects',
				//  			selectionBinding: 'Habitqueue.tasksController.selection',
				//  			contentValueKey: "description",
				//  			contentCheckboxKey: "isDone",
				//  			rowHeight: 21,
				//  			canEditContent: YES,
				//  			canDeleteContent: YES,
				//  			target: "Habitqueue.tasksController",
				//  			action: "toggleDone"
				//  	      })
				//  	    }),

	    bottomView: SC.ToolbarView.design({
	      layout: { bottom: 0, left: 0, right: 0, height: 32 },
		  childViews: 'summaryView'.w(),
	      anchorLocation: SC.ANCHOR_BOTTOM,
	
			summaryView: SC.LabelView.design({
		        layout: { centerY: 0, height: 18, left: 20, right: 20 },
		        textAlign: SC.ALIGN_CENTER,
				valueBinding: "Habitqueue.tasksController.summary"
		      })

	    })    
    
  })

});

//probably a better way to do this
//var junk = Habitqueue.compositionChart.mainView.call_to_create_chart();
//console.log(junk);

// function () { 
// 	var canvasId = "visualization";
//      var data = new google.visualization.DataTable(); 
// return;
//             data.addColumn('string', 'Month'); 
//             data.addColumn('number', 'Sales'); 
//             data.addRows([ 
//               ['January',{v:20, f:'$20M'}], 
//               ['February',{v:31, f:'$31M'}], 
//               ['March',{v:61, f:'$61M'}], 
//               ['April',{v:26, f:'$26M'}] 
//             ]); 
//             // Create and draw the visualization. 
//             new google.visualization.PieChart( 
//               document.getElementById(canvasId)). 
//                 draw(data, {is3D:true}); 
// 			
// 		}();
			

