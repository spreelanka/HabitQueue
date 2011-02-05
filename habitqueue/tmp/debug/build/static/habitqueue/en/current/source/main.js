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
	var query = SC.Query.local(Habitqueue.Task, { orderBy: 'isDone,description' });
	var tasks = Habitqueue.store.find(Habitqueue.TASKS_QUERY);
	Habitqueue.tasksController.set('content', tasks);

} ;

function main() { Habitqueue.main(); }
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('habitqueue');