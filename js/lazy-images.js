self.addEventListener("fetch", function(event){
  console.log('fetch');
  // get request url
  var url = event.request.url;
  console.log(url);
  // if url is a jpg and does not contain the bypass parameter
  // return a blank png instead of going to the network
  if(url.match('.jpg') && !url.match('bypass-service-worker')){
    event.respondWith(fetch('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==').then(res => res));
  }

})
