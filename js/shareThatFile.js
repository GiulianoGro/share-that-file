var ShareThatFile = function(options){
  options = options || {};
  this.id = Math.random();
  this.peer = new Peer(this.id, {key: 'ic8cujjvy3bit3xr'});
  this.inputFile = options.inputFile;
  this.myFilesContainer = options.myFilesContainer;
  this.searchElement = options.searchField;
  this.searchButton = options.searchButton;
  this.searchResults = options.searchResults;
  this.searchAndExpose = new SearchAndExpose(this.id);
  this.searchAndExpose.updateon = this.updateSearchResults.bind(this);
  this.seedArchive = new SeedArchive(this.id, options.dbName || 'filesToShare', this.initApplication.bind(this));
};

ShareThatFile.prototype.initApplication = function(){
  this.inputFile.addEventListener('change', this.addNewFile.bind(this), false);
  this.myFilesContainer.addEventListener('click', this.removeFile.bind(this), false);
  this.searchButton.addEventListener('click', function(){ this.searchAndExpose.doSearch(this.searchElement.value); }.bind(this), false);
  this.searchResults.addEventListener('click', this.askForFile.bind(this), false);
  this.initEventSource();
  this.refreshList();
};

ShareThatFile.prototype.askForFile = function(evt){
  if(evt.target.hasAttribute('data-owner')){
    this.searchAndExpose.askForFile(evt.target.getAttribute('data-owner'),evt.target.textContent);
  }
};

ShareThatFile.prototype.initEventSource = function(){
  this.eventSource = new EventSource('/dispatcher.php?action=eventsPing&asker=' + this.id);
  this.eventSource.addEventListener('search', function(evt){  
    var data = JSON.parse(evt.data);
    this.seedArchive.doSearch(data.term, data.owner);
  }.bind(this), false);
  this.eventSource.addEventListener('searchresults',function(evt){
    var data = JSON.parse(evt.data);
    this.searchAndExpose.updateResults(data.term, data.owner, data.files);
  }.bind(this), false);
};

ShareThatFile.prototype.addNewFile = function(event){
  var fileRaw = event.target.files[0];
  var fileReader = new FileReader();
  var file;
  if(fileRaw){
    fileReader.readAsDataURL(fileRaw);
    fileReader.addEventListener('loadend', function(evt){
      file = [{name: fileRaw.name, size: fileRaw.size, type: fileRaw.type, body: evt.target.result}];
      this.seedArchive.addFiles(file, this.refreshList.bind(this));
    }.bind(this),false);
  }  
};

ShareThatFile.prototype.refreshList = function(){
  this.seedArchive.getFileList(this.printFileList.bind(this));
};

ShareThatFile.prototype.printFileList = function(allFiles){
  var template = document.createElement('ul');
  for(var x = 0; x < allFiles.length; x++){
    var currentFile = allFiles[x];
    template.insertAdjacentHTML('beforeend', '<li>' + currentFile.name + ' <a data-file-id="' + currentFile.id + '">(x)</a></li>');
  }
  this.myFilesContainer.innerHTML = template.outerHTML;
};

ShareThatFile.prototype.removeFile = function(event){
  if(event.target.dataset.fileId){
    this.seedArchive.deleteFileById(parseInt(event.target.dataset.fileId,10), this.refreshList.bind(this));
  }
};

ShareThatFile.prototype.updateSearchResults = function(results){
  var resultsHTML = "";
  for(result in results){
    if(results.hasOwnProperty(result)){
      resultsHTML += "<b>" + result + "</b><ul>";
      for(var x = 0; x < results[result].results.length; x++){
        var currentResult = results[result].results[x];
        resultsHTML += "<li><a data-owner='" + currentResult.owner + "'>" + currentResult.name + "</a></li>";   
      }
      resultsHTML += "</ul>";
    }
  }
  this.searchResults.innerHTML = resultsHTML;
};