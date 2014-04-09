describe("SearchAndExpose", function(){
  
  it("exists as class", function(){
    expect(SearchAndExpose).toBeDefined();
  });
  
  it("calls the postRequest", function(){
    var searcher = new SearchAndExpose(12);
    spyOn(searcher, 'postRequest');
    searcher.doSearch('hello');
    expect(searcher.postRequest).toHaveBeenCalled();
  });
  
  it("adds the search item to results", function(){
    var searcher = new SearchAndExpose(12);
    searcher.handleResults('hello');
    expect(searcher.results['hello'].active).toBeTruthy();
  });
  
  it("set the search item to false after 10sec", function(){
    jasmine.clock().install(); 
    var searcher = new SearchAndExpose(12);
    searcher.handleResults('hello');
    jasmine.clock().tick(10001);
    expect(searcher.results['hello'].active).toBeFalsy();
  });
  
  it("calls the callback after the search", function(){
    var searcher = new SearchAndExpose(12); 
    searcher.updateon = function(){};
    spyOn(searcher, 'updateon'); 
    searcher.handleResults('hello'); 
    expect(searcher.updateon).toHaveBeenCalled(); 
  });
  
  it("update the results", function(){
    var searcher = new SearchAndExpose(12);
    searcher.handleResults('halo');
    searcher.updateon = function(){};
    spyOn(searcher, 'updateon');
    searcher.updateResults('halo',14,[{name: 'halo4'}]);
    expect(searcher.results['halo']).toBeDefined();
    expect(searcher.results['halo'].results.length).toBe(1);
    expect(searcher.results['halo'].results[0].name).toBe('halo4');
    expect(searcher.updateon).toHaveBeenCalled(); 
  });
  
})