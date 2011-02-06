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
	description: SC.Record.attr(String)

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('habitqueue');