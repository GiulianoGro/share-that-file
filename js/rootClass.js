function RootClass(){
  
};

RootClass.prototype.postRequest = function(args, callback){
  var req = new XMLHttpRequest();
  var self = this;  
  req.open("POST", "/dispatcher.php", true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = function () {
    if (req.readyState != 4 || req.status != 200) return;
    if (callback) callback.call(req);
  };
  req.send(  "action=" + encodeURIComponent('postAction') + 
             "&message=" + encodeURIComponent(args.message) + 
             "&sender=" + encodeURIComponent(this.id) + 
             "&event=" + encodeURIComponent(args.event) +  
             "&receiver=" + encodeURIComponent(args.receiver || '*')
  );
};