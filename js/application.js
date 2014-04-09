function init(){
  new ShareThatFile({
    inputFile: document.querySelector('input[type=file]'),
    myFilesContainer: document.getElementById('refresh-list'),
    searchField: document.querySelector('input[type=search]'),
    searchButton: document.querySelector('button'),
    searchResults: document.getElementById('current-searches')
  });
}

window.addEventListener('load', init, false);