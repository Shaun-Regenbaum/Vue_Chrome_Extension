// This file contains the initial functionality to place the default lists into local storage
// In addition it contains the functions to return boolean values to our initial switch values in the front end.

function setDefaultStorage(details) {
    // We will eventually want to only do this on install
    console.log("Setting Default Lists")
    if (details.reason == 'install' || details.reason == 'update') {
        chrome.storage.sync.set({
            blacklistDict: blacklistDict,
            spoofWhitelistDict: spoofWhitelistDict,
            redirectWhitelistDict: redirectWhitelistDict,
            cookieWhitelistDict: cookieWhitelistDict,
            javascriptBlacklistDict: javascriptBlacklistDict
        });
    }
}

// This is a short function to turn Chrome's callback system into a promise
// 
function storageGetAsync(keys) { 
    return new Promise( (resolve, reject) => {
       chrome.storage.sync.get(keys, (result) => {
            if (result) {
               resolve(result);
            } else {
               reject("Oh no!")
            }
        });  
    })
}

async function getInitialSwitchValues() {

    const lists = ["blacklistDict","spoofWhitelistDict", "redirectWhitelistDict", "cookieWhitelistDict", "javascriptBlacklistDict"];
   
    const rootUrl = await currentUrlAsync(); // This is returning a Promise
    const result = await storageGetAsync(lists); // This is returning a Promise

    const values = Promise.all([rootUrl, result]).then((results) => {
        
        const values = {}
        console.log("Results: ", results[0], results[1])
        for (i = 0; i < lists.length; i++ ){
 
            // Results[0] = Current Url
            // Results[1] = Site Lists in Storage
            values[lists[i]] = (String(results[0]) in results[1][lists[i]]);
        }

        console.log("Values: ", values);
        return values;
    });
    return values;
}

// Be Careful:
// There can't be any inconsistency between how many lists you have and the amount of booleans you are passing in.
// They should both be arrays.
async function saveToStorage(bools) {
    
    const lists = ["blacklistDict","spoofWhitelistDict", "redirectWhitelistDict", "cookieWhitelistDict", "javascriptBlacklistDict"];

    const rootUrl = await currentUrlAsync(); // This is returning a Promise
    const result = await storageGetAsync(lists); // This is returning a Promise


    Promise.all([rootUrl, result]).then((results) => {

        
        let values = {};
        let updatedList = {}

        // Results[0] = Current Url
        // Results[1] = Site Lists in Storage

        for (i = 0; i < lists.length; i++ ){

            updatedList = results[1][lists[i]];
            if (bools[i]) {
                updatedList[results[0]] = bools[i];
            } else {
                delete updatedList[results[0]];
            }
            values[lists[i]] = updatedList;
            } 
        chrome.storage.sync.set(values);
    });
};