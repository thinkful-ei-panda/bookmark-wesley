import bookmarkApp from './bookmark-app.js';
import store from './store.js';
import api from './api.js';

//Main function
let main=function(){
  //populate store with bookmarks from api
  api.getBookmarks()
    .then(bookmarks => {
      bookmarks.forEach(bookmark => store.postBookmarkToStore(bookmark));
      
      //call render function
      bookmarkApp.render();
    });

  //call event handlers
  bookmarkApp.handleEvents();


};


$(main);