function cleanUpUrl(url) {
    try {
        //Form should be in http[s]://root.com/abcdefg
        if (url.substring(0,4) !== "http") {
            return "failed";
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
            return "failed";
        }

        root = parts[parts.length - 2] + "." + parts[parts.length - 1];

        return "*://*." + root + "/*"
    }
    catch {
        return "failed";
    }
  }

function currentUrl(callback) { 
    chrome.tabs.query({active:true, currentWindow:true},function(tabs){
        if (tabs == undefined) {
            console.log("Empty?")
        } else {
            console.log("Not Empty")
        }
        console.log(tabs);
        callback(this.cleanUpUrl(tabs[0].url));
      });
}

function returnRootUrl(url) {
    const rootUrl = url;
    return rootUrl;
}

// Not sure if this is ok to do?
function getCurrentRootUrl() { 
    console.log(currentUrl(returnRootUrl));
    return currentUrl(returnRootUrl);
}