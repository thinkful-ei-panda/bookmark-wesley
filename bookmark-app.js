//User Stories: 

//I can add bookmarks to my bookmark list. Bookmarks contain:

// title
// url link
// description
// rating (1-5)
// I can see a list of my bookmarks when I first open the app

// All bookmarks in the list default to a "condensed" view showing only title and rating
// I can click on a bookmark to display the "detailed" view

// Detailed view expands to additionally display description and a "Visit Site" link
// I can remove bookmarks from my bookmark list

// I receive appropriate feedback when I cannot submit a bookmark

// Check all validations in the API documentation (e.g. title and url field required)
// I can select from a dropdown (a <select> element) a "minimum rating" to filter the list by all bookmarks rated at or above the chosen selection

// (Extension feature - optional) I can edit the rating and description of a bookmark in my list

import store from './store.js';
import api from './api.js';

//Get ID
let getIdByElement=function(target){
  return $(target).attr('id');
};


//Render the page
let render=function(){
  let html='';

  //conditionally check adding to see what html to generate
  //and then call appropriate generateHtml
  if(store.adding===true){
    html=generateAddingHtml();
  } else{
    html=generateListViewHtml();
  } 

  //replace previous html with new html  
  $('main').html(html);
};

//generate html for the Adding Bookmarks page
let generateAddingHtml=function(){
  return `<form class='adding-form' action="">
            <fieldset>
                <legend hidden>Add Bookmark Form</legend>
                <div>
                    <label for='title-bookmark-form'>Add Bookmark:</label>
                    <input id='title-bookmark-form' name='title' type='text' required placeholder='Google'>
                </div>
                <div>
                    <label for='rating-bookmark-form'>Rating (1-5):</label>
                    <input id='rating-bookmark-form' name='rating' type='text' required placeholder='5'>
                </div>
                <div>
                    <label for='link-bookmark-form'>Link:</label>
                    <input id='link-bookmark-form' name='url' type='text' required placeholder='http://www.google.com'>
                </div>
                <div>
                    <label for='description-bookmark-form'>Description:</label>
                    <input id='description-bookmark-form' name='desc' type='text' placeholder='a search engine'>
                </div>
                <div class='buttons-container'>
                  <button type='submit' class='add-bookmark-submit'>Add Bookmark</button>
                  <button type='button' class='add-bookmark-cancel'>Cancel</button>
                </div>
            </fieldset>
        </form>
        <div class='error-container'></div>`;
        
};

//generate html for the List View page
let generateListViewHtml=function(){
  let itemHtml='';
  store.bookmarks.filter(item=>item.rating>=store.filter).forEach(item=>{
    itemHtml+=generateItemHtml(item);
  });

  //select menu currently selected
  let filterRating='';
  if(store.filter<2){
    filterRating='All';
  } else if (store.filter===5){
    filterRating='5';
  } else {
    filterRating=`${store.filter}+`;
  }



  return `<div class='sort-container'>
            <div>
              <button class='new-bookmark'>Add New Bookmark</button>
            </div>
            <div>
              <form action="/action_page.php">
                  <label for="stars-select">Filter by Rating:</label>
                  <select name="stars-select" id="stars-select">
                  <option value="" disabled selected>${filterRating}</option>
                  <option value=5>5</option>
                  <option value=4>4+</option>
                  <option value=3>3+</option>
                  <option value=2>2+</option>
                  <option value=1>All</option>
                  </select>
              </form>
            </div>
          </div>
          <ul class='results-container'>${itemHtml}</ul>`;
};

//generate html for one item
let generateItemHtml=function(item){
  if (item.expanded===true){
    return `<li class='expanded-listing' tabindex='0' id=${item.id}>
              <div class='bookmark-expanded-header'>
                  <div class='bookmark-name-expanded'>${item.title}</div>
                  <div class='delete-button-container'>
                      <button class='bookmark-delete-button'>Delete</button>
                  </div>
              </div>
              <section class='bookmark-info'>
                  <a class='visit-site' href='${item.url}' target="_blank">Visit Site</a>
                  <div class='bookmark-rating-expanded'>Rating: ${item.rating}</div>
                  <div class='bookmark-description'>${item.desc}</div>                    
              </section>
            </li>`;
  } else{
    return `<li class='bookmark-listing' tabindex='0' id=${item.id}>            
                <div class='bookmark-name'>${item.title}</div>
                <div class='bookmark-rating'>Rating: ${item.rating}</div>
            </li>`;
                    
  }
};

//Initial View Events
//event listener for adding a new bookmark

let handleAddBookmarkButton=function(){
  //event listener
  $('main').on('click','.new-bookmark', event => {

    //change store's adding value to true    
    store.adding=!store.adding;

    //render
    render();
  });
};

//event listener for filtering bookmarks
let handleFilterBookmark=function(){
  $('main').on('change','#stars-select', event => {
    store.filter=parseInt($(event.target).val());
    render();
  });
};

//event listener for expanding each bookmark
let handleExpandBookmark=function(){
  $('main').on('click','.bookmark-listing', event => {
    const id=getIdByElement(event.currentTarget);
    
    //toggle off previously expanded if there was one
    if(store.bookmarks.find(bookmark => bookmark.expanded===true)){      
      store.bookmarks.find(bookmark => bookmark.expanded===true).expanded=false;
    }

    //expand target bookmark
    store.findById(id).expanded=!(store.findById(id).expanded);
    render();
  })
    .on('keypress','.bookmark-listing', function(e) {
      if(e.which === 13) {
        $(this).trigger( 'click' );
      }
    });
};

//Expanded Bookmark Events
//event listener for deleting bookmark
let handleDeleteBookmark=function(){  
  $('main').on('click','.bookmark-delete-button', event => {
    event.stopPropagation();
    let id=$(event.currentTarget.closest('.expanded-listing')).attr('id');
    let bookmark=store.findById(id);
    api.deleteBookmarkFromApi(id)
      .then(() => {
        store.deleteBookmarkFromStore(bookmark);
        render();
      })
      .catch(error => {
        store.error=error;
        renderError();
      });      
  })
    .on('keypress','.bookmark-delete-button', function(e) {
      if(e.which === 13) {
        $(this).trigger( 'click' );
      }
    });
};

//event listener for condensing each bookmark (optional)
let handleCondenseBookmark=function(){
  $('main').on('click','.expanded-listing', event => {
    
    const id=getIdByElement(event.currentTarget);
    store.findById(id).expanded=!(store.findById(id).expanded);
    render();
  })
    .on('keypress','.expanded-listing', function(e) {
      if(e.which === 13) {
        $(this).trigger( 'click' );
      }
    });
};

//Add Bookmark Events
//event listener for creating new bookmark
let handleSubmitBookmark=function(){
  //event listener
  $('main').submit('.add-bookmark-submit', event => {
    event.preventDefault();
    const formData=serializeJson(event.target.closest('form'));
    api.postBookmarkToApi(formData)
      .then((bookmark)=>{
        store.postBookmarkToStore(bookmark);
        store.adding=!store.adding;
        if(store.error){
          store.error=null;
        }
        render();
      })
      .catch(error => {
        store.error=error;
        renderError();
      });    
  });
};

//serializeJSON from form data
function serializeJson(form) {
  const formData = new FormData(form);
  const o = {};
  formData.forEach((val, name) => {
    return o[name] = val;
  });
  return JSON.stringify(o);
}

//generate error
const generateError = function (error) {
  return `
      <section class="error-content">        
        <button id="cancel-error">x</button>
        <div>${error.message}</div>        
      </section>
    `;
};

//render error
const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

//event listener to cancel creation
let handleCancelBookmark=function(){
//event listener
  $('main').on('click','.add-bookmark-cancel', event => {
    store.adding=!store.adding;
    if(store.error){
      store.error=null;
    }
    render();
  });
};

//Error Form Events
//event listener for closing error message
let handleError=function(){
  $('main').on('click','#cancel-error', event => {
    store.error=null;
    renderError();
  });
};

let handleEvents=function(){
  handleAddBookmarkButton();
  handleFilterBookmark();
  handleCondenseBookmark();
  handleExpandBookmark(); 
  handleDeleteBookmark();
  handleSubmitBookmark();
  handleCancelBookmark();  
  handleError();
};

export default {
  handleEvents,
  render
};