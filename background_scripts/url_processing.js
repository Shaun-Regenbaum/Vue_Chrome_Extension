function cleanUpUrl(url) {
    try {
        //Form should be in http[s]://root.com/abcdefg
        if (url.substring(0,4) !== "http") {
            return false;
        }

        //Make into root.com/abcdefg
        let root = url.split("://")[1];

        //Make into root.com
        root = root.split("/")[0];

        //Delete www. if included
        if (root.includes("www.")) {
        root = root.substring(4);
        }
        //Ensure root (if it is in form sub.root.com)
        parts = root.split(".");

        if (parts.length < 2) {
            return false;
        }

        root = parts[parts.length - 2] + "." + parts[parts.length - 1];

        return "*://*." + root + "/*"
    }
    catch {
        return false;
    }
  }

function currentUrl(callback) { 
    chrome.tabs.query({active:true, currentWindow:true},function(tabs){
        console.log(tabs);
        callback(this.cleanUpUrl(tabs[0].url));
    });
}

function currentUrlAsync() { 
    return new Promise( (resolve, reject) => {
       chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            console.log(tabs);
            if (tabs) {
              const processedURL = this.cleanUpUrl(tabs[0].url)
              if (processedURL) {
                  resolve(processedURL);
              }
            } else {
               reject("Oh no!")
            }
            
        });  
    })
}