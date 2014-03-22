var SeedArchive = function(dbName, callback){

  // mini polyfill
  this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
  
  // variabili di istanza
  this.dbName = dbName;
  
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

// aggiungo un file al database
SeedArchive.prototype.addFile = function(fileInfo, callback){
  var newFile = this.dataBase.transaction('files', 'readwrite');
  var fileStore = newFile.objectStore("files");
  fileStore.add(fileInfo);
  newFile.addEventListener('complete', callback.bind(this));
};