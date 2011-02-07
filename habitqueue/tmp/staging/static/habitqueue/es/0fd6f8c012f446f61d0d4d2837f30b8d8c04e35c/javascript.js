/* >>>>>>>>>> BEGIN bundle_info.js */
        ;(function() {
          var target_name = 'sproutcore/standard_theme' ;
          if (!SC.BUNDLE_INFO) throw "SC.BUNDLE_INFO is not defined!" ;
          if (SC.BUNDLE_INFO[target_name]) return ; 

          SC.BUNDLE_INFO[target_name] = {
            requires: ['sproutcore/empty_theme'],
            styles:   ['/static/sproutcore/standard_theme/es/8b65428a7dcfa2226586b487bde1bf11560de2aa/stylesheet-packed.css','/static/sproutcore/standard_theme/es/8b65428a7dcfa2226586b487bde1bf11560de2aa/stylesheet.css'],
            scripts:  ['/static/sproutcore/standard_theme/es/8b65428a7dcfa2226586b487bde1bf11560de2aa/javascript-packed.js']
          }
        })();

/* >>>>>>>>>> BEGIN source/core.js */
// ==========================================================================
// Project:   Habitqueue
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Habitqueue = SC.Application.create(
  /** @scope Habitqueue.prototype */ {

  NAMESPACE: 'Habitqueue',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.

	store: SC.Store.create({ 
	  commitRecordsAutomatically: YES
	}).from('Habitqueue.TaskDataSource')
	
	//##or fixtures if you prefer
	// store: SC.Store.create().from(SC.Record.fixtures)
  
  // TODO: Add global constants or singleton objects needed by your app here.

}) ;

/* >>>>>>>>>> BEGIN source/controllers/tasks.js */
// ==========================================================================
// Project:   Habitqueue.tasksController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Habitqueue.tasksController = SC.ArrayController.create(
	SC.CollectionViewDelegate,
/** @scope Habitqueue.tasksController.prototype */ {

	summary: function() {
	    var len = this.get('length'), ret ;
		SC.mydebug2=this;

	    if (len && len > 0) {
	      ret = len === 1 ? "1 task" : "%@ tasks".fmt(len);
	    } else ret = "No tasks";

	    return ret;
	  }.property('length').cacheable()
	,
	  collectionViewDeleteContent: function(view, content, indexes) {

	    // destroy the records
	    var records = indexes.map(function(idx) {
	      return this.objectAt(idx);
	    }, this);
	    records.invoke('destroy');

	    var selIndex = indexes.get('min')-1;
	    if (selIndex<0) selIndex = 0;
	    this.selectObject(this.objectAt(selIndex));
	  }
	,
	  addTask: function() {
	    var task;

	    // create a new task in the store
	    task = Habitqueue.store.createRecord(Habitqueue.Task, {//Cannot call method '_computeNextValidKeyView' of null
	      "description": "New Task", 
	      "isDone": false,
		  "procrasts": 0,
		  "tag": "unknown"
	    });

	    // select new task in UI
	    this.selectObject(task);

	    // activate inline editor once UI can repaint
	    this.invokeLater(function() {
	      var contentIndex = this.indexOf(task);
	      var list = Habitqueue.mainPage.getPath('mainPane.middleView.contentView.topLeftView');
	      //var listItem = list.itemViewForContentIndex(contentIndex);//this breaks cause of the layout/splitview. fix later
	      // listItem.beginEditing(); 
	    });

	    return YES;
	  }
	,
	  toggleDone: function() {
	    var sel = this.get('selection');
	    sel.setEach('isDone', !sel.everyProperty('isDone'));
	    return YES;
	  }

}) ;

/* >>>>>>>>>> BEGIN source/models/task.js */
// ==========================================================================
// Project:   Habitqueue.Task
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Habitqueue.Task = SC.Record.extend(
/** @scope Habitqueue.Task.prototype */ {

	primaryKey: "_id",
	isDone: SC.Record.attr(Boolean),
	description: SC.Record.attr(String),
	procrasts: SC.Record.attr(Number),
	tag: SC.Record.attr(String),
	

}) ;

/* >>>>>>>>>> BEGIN source/data_sources/task.js */
// ==========================================================================
// Project:   Habitqueue.TaskDataSource
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */
//sc_require('models/task');
Habitqueue.TASKS_QUERY = SC.Query.local(Habitqueue.Task, {
  orderBy: 'isDone,description'
});
/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
Habitqueue.TaskDataSource = SC.DataSource.extend(
/** @scope Habitqueue.TaskDataSource.prototype */ {
	
	_dbpath: 'habitqueue',

	 getServerPath: function(resourceName) {
	   var path = '/' + this._dbpath + "//" + resourceName;
	   return path;
	 },
	
	getServerView: function(viewName) {
		var path = '/' + this._dbpath + "/_design/app/_view/" + viewName;
		return path;
	},
	

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
     if (query === Habitqueue.TASKS_QUERY) {
		console.log(this.getServerView('allTasks'));
          SC.Request.getUrl(this.getServerView('allTasks')).json()
                         .header('Accept', 'application/json')
                         .notify(this, 'didFetchTasks', store, query)
                         .send();
          return YES;

     }
    return NO ; // return YES if you handled the query
  },
  didFetchTasks: function(response, store, query) {
	  if(SC.ok(response)) {
	    var body = response.get('encodedBody');
	    var couchResponse = SC.json.decode(body);
	    var records = couchResponse.rows.getEach('value');
	    store.loadRecords(Habitqueue.Task, records);
	    store.dataSourceDidFetchQuery(query);
	 } else {
	    store.dataSourceDidErrorQuery(query, response);
	 }
	 },


  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
      if (SC.kindOf(store.recordTypeFor(storeKey), Habitqueue.Task)) {
			var id = store.idFor(storeKey);
			SC.Request.getUrl(this.getServerPath(id))
			          .header('Accept', 'application/json').json()
			      .notify(this, 'didRetrieveTask', store, storeKey)
			      .send();

			return YES;
		}
  },

  didRetrieveTask: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var dataHash = response.get('body').content;
      store.dataSourceDidComplete(storeKey, dataHash);

    } else store.dataSourceDidError(storeKey, response);
  }, 

  /**
     Process response from CouchDB of create, update, delete operations. @returns id,rev for success, null for failure. */
     processResponse: function(response) {
 	         if (SC.ok(response)) {
	               var body = response.get('encodedBody');
	               var couchResponse = SC.json.decode(body);
	               var ok = couchResponse.ok;
	               if (ok != YES) return {"error":true, "response":couchResponse};
	                    var id = couchResponse.id;
	                    var rev = couchResponse.rev;
	                    return {"ok":true, "id": id, "rev": rev};
	               } else {
	    	               return {"error":true, "response":response};
	               }
	       },
	  /**
	Get the latest revision of the document. For docs which were fetch from the server we use _rev field, and for docs that were modified we use the local _docsRev dictionary. */
	  getDocRev: function(doc) {
			return doc._rev;
	  },
  
  	createRecord: function(store, storeKey) {
	     if (SC.kindOf(store.recordTypeFor(storeKey), Habitqueue.Task)) {
	          SC.Request.postUrl(this.getServerPath('/')).json()
	                            .header('Accept', 'application/json')
	                            .notify(this, this.didCreateTask, store, storeKey)
	                            .send(store.readDataHash(storeKey));
	          return YES;
	    } 
	    return NO ; // return YES if you handled the storeKey
	  },
	didCreateTask: function(response, store, storeKey) {
	     var couchRes = this.processResponse(response);
	     if (couchRes.ok) {
	          // Add _id and _rev to the local document for further server interaction.
	          var localDoc = store.readDataHash(storeKey);
	          localDoc._id = couchRes.id;
	          localDoc._rev = couchRes.rev;
	          store.dataSourceDidComplete(storeKey, localDoc, couchRes.id);
	     } else {
	        store.dataSourceDidError(storeKey, response);
	     }
	},
  
  	updateRecord: function(store, storeKey) {    
	  if (SC.kindOf(store.recordTypeFor(storeKey), Habitqueue.Task)) {
	     var id = store.idFor(storeKey);
	     var dataHash = store.readDataHash(storeKey);
	     SC.Request.putUrl(this.getServerPath(id)).json()
	                       .header('Accept', 'application/json')
	                      .notify(this, this.didUpdateTask, store, storeKey)
	                        .send(dataHash);
	     return YES;
	   }
	   return NO;
	},
	didUpdateTask: function(response, store, storeKey) {
	   var couchRes = this.processResponse(response);
	   if (couchRes.ok) {
	     // Update the local _rev of this document.
	     var localDoc = store.readDataHash(storeKey);
	     localDoc._rev = couchRes.rev;
	     store.dataSourceDidComplete(storeKey, localDoc) ;
	   } else {
	     store.dataSourceDidError(storeKey);
	   }
	},
  	destroyRecord: function(store, storeKey) {
	    if (SC.kindOf(store.recordTypeFor(storeKey), Habitqueue.Task)) {
	          var id = store.idFor(storeKey);
	          //var rev = this._docsRev[id];
	          var dataHash = store.readDataHash(storeKey);
	          var rev = this.getDocRev(dataHash);
	          SC.Request.deleteUrl(this.getServerPath(id + "?rev=" + rev)).json()
	                            .header('Accept', 'application/json')
	                            .notify(this, this.didDeleteTask, store, storeKey)
	                            .send();
	          return YES;
	     } 
	     return NO ; // return YES if you handled the storeKey
	  },
  	didDeleteTask: function(response, store, storeKey) {
	     var couchRes = this.processResponse(response);
	     if (couchRes.ok) {
	          store.dataSourceDidDestroy(storeKey);
	     } else {
	          store.dataSourceDidError(response);
	     }
	  }
  
}) ;

/* >>>>>>>>>> BEGIN source/resources/main_page.js */
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
		var ret='<div class="icon"><div class="inner"><img src="%@" class="icon sc-icon-%@-%@" style="height: %@px; width: %@px; position: relative" /></div><label>sc-icon-%@-%@</label></div>'.fmt('/static/sproutcore/foundation/es/760e3e0dd716bca963274213a64ff4ff49ea4636/blank.gif', k, iconSize, iconSize, iconSize, k, iconSize);
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
			


/* >>>>>>>>>> BEGIN source/main.js */
// ==========================================================================
// Project:   Habitqueue
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Habitqueue.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  Habitqueue.getPath('mainPage.mainPane').append() ;

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!

  // TODO: Set the content property on your primary controller
  // ex: Habitqueue.contactsController.set('content',Habitqueue.contacts);
	// var query = SC.Query.local(Habitqueue.Task, { orderBy:'isDone, description' });
	var query = Habitqueue.TASKS_QUERY;
	var tasks = Habitqueue.store.find(query);

	Habitqueue.tasksController.set('content', tasks);

} ;

function main() { Habitqueue.main(); }

