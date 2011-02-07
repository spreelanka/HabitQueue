// ==========================================================================
// Project:   Habitqueue - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */



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
					bottomRightView: SC.SplitView.design({
			          layout: { left: 0, top: 70, right: 0, bottom: 0 },
			          layoutDirection: SC.LAYOUT_HORIZONTAL,
					})
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
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('habitqueue');