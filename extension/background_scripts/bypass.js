// This file is not neccesarilly intuitive. Since our state is being managed by the front end Vue instance,
// and our source of truth is the chrome storage, we need to figure out what to do on a given website when it is first loaded.
// We first go to storage and then check if the current site is in any of the lists in storage, we then call our base functions
// according to what lists it is in.

function bypassPaywallOnLoad(http_details) {
    const rootUrl = cleanUpUrl(http_details.url)

    // The following is done asynchronously (I think)
    chrome.storage.sync.get(["blacklistDict","spoofWhitelistDict", "redirectWhitelistDict", "cookieWhitelistDict", "javascriptWhitelistDict"],
    (result) => { 
       
        console.log("Working on " + rootUrl)

        if (!(rootUrl in result.blacklistDict)) {
            enableCookies(rootUrl);
            enableJavascript(rootUrl);
        } else {
            if (!(rootUrl in result.spoofWhitelistDict)) {
                adbotSpoof(http_details);
            }

            if (!(rootUrl in result.redirectWhitelistDict)) {
                redirectReferer(http_details, 'https://t.co/');
            }

            if (!(rootUrl in result.cookieWhitelistDict)) { 
                blockCookies(rootUrl);
            } else {
                enableCookies(rootUrl);
            }

            if (rootUrl in result.javascriptBlacklistDict) {
                blockJavascript(rootUrl);
            } else {
                enableJavascript(rootUrl);
            }
        }    
    });
    return {requestHeaders: http_details.requestHeaders};
}