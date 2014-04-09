describe("seedArchive", function() {

  it("has a class seedArchive", function() {
    expect(SeedArchive).toBeDefined();
  });
  
  it("can be destroyed", function (done) {
    var seed = new SeedArchive(12, 'myFilesTest', function(){
      this.deleteArchive(done);
    });
  })

  it("can be initialized", function(done){
    var seed = new SeedArchive(12, 'myFilesTest', function(dataBase){
      expect(dataBase).toBeDefined();
      this.release();
      done();
    });
    expect(seed).toBeDefined();
    expect(seed.indexedDB).toBe(window.indexedDB);
  });
  
  it("contains a files store and an index", function(done){
    var seed = new SeedArchive(12, 'myFilesTest', function(dataBase){
      var checkStore = dataBase.transaction('files');
      var store = checkStore.objectStore('files');
      expect(store).toBeDefined();
      expect(store.index('name')).toBeDefined();
      this.release();
      done();
    });
  });
  
  it("let you add a new file object", function(done){
    var seed = new SeedArchive(12, 'myFilesTest', function(){
      this.addFiles([{name: 'testFile.jpg'}], function(){
        this.release();
        done();
      });
    });
  });
  
  it("let you retrieve the whole file objects list", function(done){
    var seed = new SeedArchive(12, 'myFilesTest', function(){
      this.getFileList(function(fileList){
        expect(fileList).toBeDefined();
        expect(fileList.length).toEqual(1);
        expect(fileList[0].name).toEqual('testFile.jpg');
        this.release();
        done();
      }); 
    });
  });
  
  it("let you delete a file by its id", function(done){
    var seed = new SeedArchive(12, 'myFilesTest', function(){
      this.getFileList(function(allFiles){
        var length = allFiles.length;
        var idToDelete = allFiles[0].id;
        this.deleteFileById(idToDelete, function(){
          this.getFileList(function(fileList){
            expect(fileList.length).toEqual(length - 1);
            this.release();
            done();
          });  
        });
      });
    });
  });
  
  it("let you search a file by its name", function(done){
    var seed = new SeedArchive(12, 'myFilesTest', function(){
      this.addFiles([{name: 'alice in wonderland.jpg'}, {name: 'another title.jpg'}], function(){
        var nameRange =  this.IDBKeyRange.bound("alice", "alicez", true, true);
        this.getFileList(function(fileList){
          expect(fileList[0].name).toEqual('alice in wonderland.jpg');
          expect(fileList.length).toEqual(1);
          done();
        }, nameRange);
      });
    });
  });
  
});