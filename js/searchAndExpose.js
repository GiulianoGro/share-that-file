var SearchAndExpose = function(id){
  this.results = {};
  this.id = id;
};

SearchAndExpose.prototype = new RootClass();

SearchAndExpose.prototype.doSearch = function(term){
  this.postRequest({
    event: 'search',
    message: JSON.stringify({owner: this.id ,term: term})
  }, function () {
    this.handleResults(term);
  }.bind(this));
}
 
SearchAndExpose.prototype.handleResults = function(term){
  this.results[term] = { 
    active: true,
    results: []
  };
  
  setTimeout(function(){ 
    this.results[term].active = false; 
    this.callUpdate();
  }.bind(this), 10000);
  
  this.callUpdate();
};

SearchAndExpose.prototype.callUpdate = function(){
  if(this.updateon){
    this.updateon(this.results);
  }
};

SearchAndExpose.prototype.updateResults = function(term, owner, results){
  if(this.results[term] && this.results[term].active){
    for(var x=0; x < results.length; x++){
      this.results[term].results.push({
        id: results[x].id,
        name: results[x].name,
        owner: owner
      });
    }
  }
  this.callUpdate(); 
}

SearchAndExpose.prototype.askForFile = function(fileowner,filename){
  this.postRequest({
    event: 'askforfile',
    receiver: fileowner,
    message: JSON.stringify({owner: this.id, filename: filename})
  });
}
