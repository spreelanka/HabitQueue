// ==========================================================================
// Project:   Habitqueue - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */
var junk= SC.TableColumn.create({
    key:   'description',
    label: 'Task',
    width: 500
  });
var tableColumns = [
  SC.TableColumn.create({
    key:   'description',
    label: 'Task',
    width: 500
  }),
  SC.TableColumn.create({
    key:   'tag',
    label: 'Tag',
	width: 200,
    minWidth: 150
  }),
  SC.TableColumn.create({
    key:   'procrasts',
    label: 'Procrasts',
    width: 200,
    minWidth: 150
  })  
];


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
////working tableview uneditable
	    // middleView: SC.TableView.design({
	    //   backgroundColor: "white",
	    //   layout: { top: 42, bottom: 42, left: 0, right: 0 },
	    // 
	    //   columns: tableColumns,
	    //   flexibleColumn:   tableColumns.objectAt(0),
	    //   contentBinding:   'Habitqueue.tasksController.arrangedObjects',
	    //   selectionBinding: 'Habitqueue.tasksController.selection',
	    //   canReorderContent: YES,
	    //   exampleView: SC.TableRowView,
	    //   recordType: Habitqueue.Task
	    // }),
	
		middleView: SC.ScrollView.design({
	 	      hasHorizontalScroller: NO,
	 	      layout: { top: 36, bottom: 32, left: 0, right: 0 },
	 	      backgroundColor: 'white',
	 
	 	      contentView: SC.TableView.design({
			      backgroundColor: "white",
			      layout: { top: 42, bottom: 42, left: 0, right: 0 },

			      columns: tableColumns,
			      flexibleColumn:   tableColumns.objectAt(0),
			      contentBinding:   'Habitqueue.tasksController.arrangedObjects',
			      selectionBinding: 'Habitqueue.tasksController.selection',
			      canReorderContent: YES,
			      exampleView: SC.TableRowView,
			      recordType: Habitqueue.Task
			    })
	 	    }),
	
	
///original
	 // SC.ScrollView.design({
	 // 	      hasHorizontalScroller: NO,
	 // 	      layout: { top: 36, bottom: 32, left: 0, right: 0 },
	 // 	      backgroundColor: 'white',
	 // 
	 // 	      contentView: SC.ListView.design({
	 // 			contentBinding: 'Habitqueue.tasksController.arrangedObjects',
	 // 			selectionBinding: 'Habitqueue.tasksController.selection',
	 // 			contentValueKey: "description",
	 // 			contentCheckboxKey: "isDone",
	 // 			rowHeight: 21,
	 // 			canEditContent: YES,
	 // 			canDeleteContent: YES,
	 // 			target: "Habitqueue.tasksController",
	 // 			action: "toggleDone"
	 // 	      })
	 // 	    }),

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
