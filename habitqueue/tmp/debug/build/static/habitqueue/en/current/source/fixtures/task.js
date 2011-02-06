// ==========================================================================
// Project:   Habitqueue.Task Fixtures
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Habitqueue */

sc_require('models/task');

Habitqueue.Task.FIXTURES = [

  { "guid": "task-1",
    "description": "Build my first SproutCore app",
    "isDone": false },

  { "guid": "task-2",
    "description": "Build a really awesome SproutCore app",
    "isDone": false },

  { "guid": "task-3",
    "description": "Next, the world!",
    "isDone": false }

];
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('habitqueue');