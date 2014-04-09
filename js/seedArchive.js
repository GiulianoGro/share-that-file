var SeedArchive = function(id, dbName, callback){

  // mini polyfill
  this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
  
  // variabili di istanza
  this.dbName = dbName;
  this.id = id;
  
  // interrompi se indexedDB non è supportato
  if(!this.indexedDB){
    console.error("IndexedDB non è supportato da questo browser.");
  }
  
  // apri il database dbName, versione 1
  var request = this.indexedDB.open(this.dbName);
  
  // possibile negazione dell'autorizzazione all'accesso del DB
  request.addEventListener('error', this.genericError.bind(this), false);
 
  // definisco la struttura del database
  request.addEventListener('upgradeneeded', this.createDbStructure.bind(this), false);
 
  // in caso positivo invece procedi
  request.addEventListener('success', this.readyToInteract.bind(this, callback), false);
}

SeedArchive.prototype = new RootClass();

// salvo il dataBase nell'istanza
SeedArchive.prototype.readyToInteract = function(callback, event){
  this.dataBase = event.target.result;
  this.dataBase.addEventListener('error', this.genericError.bind(this), false);
  callback.call(this, this.dataBase);
};

// chiudo la connessione al dataBase
SeedArchive.prototype.release = function(){
  this.dataBase.close();
};

// cancello il dataBase
SeedArchive.prototype.deleteArchive = function(callback){
  this.release();
  var request = this.indexedDB.deleteDatabase(this.dbName);
  request.addEventListener('error', this.genericError.bind(this), false);
  request.addEventListener('blocked', this.genericError.bind(this), false);
  request.addEventListener('success', callback, false);
};

// stampo un errore generico
SeedArchive.prototype.genericError = function(event){
  console.error(event.type, event);
};

// creo la struttura del database
SeedArchive.prototype.createDbStructure = function(event){
  var dataBase = event.target.result;
  var store = dataBase.createObjectStore('files', {keyPath: 'id', autoIncrement: true});
  store.createIndex('name', 'name', { unique: false });
};

// aggiungo un array di file al database
SeedArchive.prototype.addFiles = function(fileInfos, callback){
  var newFile = this.dataBase.transaction('files', 'readwrite');
  var fileStore = newFile.objectStore("files");
  for(var x = 0; x < fileInfos.length; x++){
    fileStore.add(fileInfos[x]);
  }
  newFile.addEventListener('complete', callback.bind(this));
};

// recupera tutti i files del database
SeedArchive.prototype.getFileList = function(callback, nameRange){
  var getFiles = this.dataBase.transaction('files');
  var fileStore = getFiles.objectStore('files');
  if(nameRange){
   var nameIndex = fileStore.index("name");
   var fileCursor = nameIndex.openCursor(nameRange);
  }else{
   var fileCursor = fileStore.openCursor();
  }
  var files = [];
  fileCursor.addEventListener('success', function(event){
    var cursor = event.target.result;
    if(cursor){
      files.push(cursor.value);
      cursor.continue();
    }else {
      callback.call(this, files);
    }
  }.bind(this), false);
};

// elimina un file dato il suo ID
SeedArchive.prototype.deleteFileById = function(fileId, callback){
  var deleteFile = this.dataBase.transaction('files', 'readwrite');
  var fileStore = deleteFile.objectStore("files");
  var deleteRequest = fileStore.delete(fileId);
  deleteRequest.addEventListener('success', callback.bind(this),false);
};

// esegue la ricerca e ritorna i risultati
SeedArchive.prototype.doSearch = function(term, receiver){
  var nameRange = this.IDBKeyRange.bound(term, term + "z", true, true);
  this.getFileList(function(files){
    for(var x = 0; x < files.length; x++){
      delete files[x].body;
    }
    this.postRequest({
      event: 'searchresults',
      receiver: receiver,
      message: JSON.stringify({owner: this.id, term: term, files: files})
    });
  }, nameRange);      
};

// ritorna un file dato il nome
SeedArchive.prototype.getFileByName = function(name, callback){
  var getFiles = this.dataBase.transaction('files');
  var fileStore = getFiles.objectStore('files');
  var nameIndex = fileStore.index("name");
  nameIndex.get(name);
  nameIndex.addEventListener('success', function(event){
    callback.call(this, event.target.result);
  }.bind(this), false);
};