const BASEURL='https://thinkful-list-api.herokuapp.com/';

let getBookmarks=function(){
  return bookmarkApiFetch(`${BASEURL}wesley/bookmarks`);      
};

let postBookmarkToApi=function(data){
  return bookmarkApiFetch(`${BASEURL}wesley/bookmarks`,{
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:data
  });
};

let deleteBookmarkFromApi= function (id){
  return bookmarkApiFetch(`${BASEURL}wesley/bookmarks/${id}`,{
    method:'DELETE'
  });
};

const bookmarkApiFetch = function (...args) {
  // setup var in scope outside of promise chain
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        // if response is not 2xx, start building error object
        error = { code: res.status };

        // if response is not JSON type, place statusText in error object and
        // immediately reject promise
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }

      // otherwise, return parsed JSON
      return res.json();
    })
    .then(data => {
      // if error exists, place the JSON message into the error object and 
      // reject the Promise with your error object so it lands in the next 
      // catch.  IMPORTANT: Check how the API sends errors -- not all APIs
      // will respond with a JSON object containing message key
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      // otherwise, return the json as normal resolved Promise
      return data;
    });
};




export default {
  getBookmarks,
  postBookmarkToApi,
  deleteBookmarkFromApi  
};