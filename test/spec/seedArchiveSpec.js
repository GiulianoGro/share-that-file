describe("seedArchive", function() {

  it("has a class seedArchive", function() {
    expect(SeedArchive).toBeDefined();
  });
  
  it("can be destroyed", function (done) {
    var seed = new SeedArchive('myFilesTest', function(){
      this.deleteArchive(done);
    });
  })

  it("can be initialized", function(done){
    var seed = new SeedArchive('myFilesTest', function(dataBase){
      expect(dataBase).toBeDefined();
      this.release();
      done();
    });
    expect(seed).toBeDefined();
    expect(seed.indexedDB).toBe(window.indexedDB);
  });
  
  it("contains a files store and an index", function(done){
    var seed = new SeedArchive('myFilesTest', function(dataBase){
      var checkStore = dataBase.transaction('files');
      var store = checkStore.objectStore('files');
      expect(store).toBeDefined();
      expect(store.index('name')).toBeDefined();
      this.release();
      done();
    });
  });
  
  it("let you add a new file object", function(done){
    var seed = new SeedArchive('myFilesTest', function(){
      this.addFile({name: 'testFile.jpg'}, function(){
        this.release();
        done();
      });
    });
  });
  
});