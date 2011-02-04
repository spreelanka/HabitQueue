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

	isDone: SC.Record.attr(Boolean),
	description: SC.Record.attr(String)

}) ;
