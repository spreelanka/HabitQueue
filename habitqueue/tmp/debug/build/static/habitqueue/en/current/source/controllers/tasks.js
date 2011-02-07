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
	      var listItem = list.itemViewForContentIndex(contentIndex);
	      listItem.beginEditing();
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
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('habitqueue');