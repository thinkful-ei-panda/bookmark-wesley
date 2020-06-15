let bookmarks=[];
let adding=false;
let error=null;
let filter=0;

let findById=function(id){
  return this.bookmarks.find(item=>item.id===id);
};

let postBookmarkToStore=function(bookmark){
  this.bookmarks.push(bookmark);
};

let deleteBookmarkFromStore=function(bookmark){
  for(let i=0;i<this.bookmarks.length;i++){
    if (this.bookmarks[i].id===bookmark.id){
      this.bookmarks.splice(i,1);
    }
  }
};

export default {
  bookmarks,
  adding,
  error,
  filter,
  findById,
  postBookmarkToStore,
  deleteBookmarkFromStore
};