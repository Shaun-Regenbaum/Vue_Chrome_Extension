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
            javascriptWhitelistDict: javascriptWhitelistDict
        });
    }
}
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
    const lists = ["blacklistDict","spoofWhitelistDict", "redirectWhitelistDict", "cookieWhitelistDict", "javascriptWhitelistDict"];
    const rootUrl = await currentUrlAsync();

    const values = {};

    const result = await storageGetAsync(lists).then()
    for (list in lists){
        values[list] = (rootUrl in result[list]);
    }
    console.log(values);
    return values;
}
// Be Careful:
// There can't be any inconsistency between how many lists you have and the amount of booleans you are passing in.
// They should both be arrays.

async function saveToStorage(bools) {
    const lists = ["blacklistDict","spoofWhitelistDict", "redirectWhitelistDict", "cookieWhitelistDict", "javascriptWhitelistDict"];
    const rootUrl = await currentUrlAsync();
    let values = {};

    const result = await storageGetAsync(lists);
    let updatedList = {}
        for (i = 0; i < lists.length; i++ ){
            updatedList = result[lists[i]];
            if (bools[i]) {
                updatedList[rootUrl] = bools[i];
            } else {
                delete updatedList[rootUrl];
            }
            values.lists[i] = updatedList;
            } 
    chrome.storage.sync.set(values.then());
};