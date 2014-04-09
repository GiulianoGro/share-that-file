describe("shareThatFile", function() {
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  var myFilesContainer = document.createElement('div');
  var searchElement = document.createElement('input');
  var searchButton = document.createElement('button');
  var searchResults = document.createElement('div');
  var basicOptions = {
    inputFile: fileInput,
    myFilesContainer: myFilesContainer,
    searchElement: searchElement,
    searchButton: searchButton,
    searchResults: searchResults,
    dbName: 'filesToShareTest'
  };
  var application;
  
  it("has a class shareThatFile", function() {
    expect(ShareThatFile).toBeDefined();
  });
  
  it("calls the init", function(done){
    spyOn(ShareThatFile.prototype, 'initApplication').and.callFake(done);
    application = new ShareThatFile(basicOptions);
  });
  
  it("shows the files currently listed in the db", function(done){
    spyOn(ShareThatFile.prototype, 'initApplication').and.callFake(done);
    application = new ShareThatFile(basicOptions);
    application.printFileList([{name: 'fileDiProva.txt'}]);
    expect(myFilesContainer.querySelectorAll('li').length).toEqual(1);
  });
  
  it("populates a given div with the result of the searches", function(done){
    spyOn(ShareThatFile.prototype, 'initApplication').and.callFake(function(){
      application.updateSearchResults({
        prova: {
          active: true,
          results: [
            { owner: 12345, name: 'file1.txt' }
          ]
        }
      });
      expect(searchResults.querySelector('b').textContent).toEqual('prova');
      done();
    });
    application = new ShareThatFile(basicOptions);    
  });
  
  afterEach(function() {
    if(application){
      application.seedArchive.release();
    }
  });
  
});