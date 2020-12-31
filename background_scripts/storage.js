// This file contains the initial functionality to place the default lists into local storage
// In addition it contains the functions to return boolean values to our initial switch values in the front end.

function setDefaultStorage(details) {
    // We will eventually want to only do this on install
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

function getInitialSwitchValues() {
    const lists = ["blacklistDict","spoofWhitelistDict", "redirectWhitelistDict", "cookieWhitelistDict", "javascriptWhitelistDict"];
    const url = getCurrentRootUrl();
    const values = {};
    chrome.storage.sync.get(lists,
    (result) => {
        for (list in lists) {
            values[list] = (url in result[list]);
        }
    });
    return values;

}

function saveToStorage(bools) {
    const lists = ["blacklistDict","spoofWhitelistDict", "redirectWhitelistDict", "cookieWhitelistDict", "javascriptWhitelistDict"];
    const url = getCurrentRootUrl();
    let values = {};

    if (bools.length == lists.length){
        continue;
    } else {
        console.log("There is some inconsistency with how many lists you have and the amount of booleans you are pasisng in. They should both be arrays.")
    }

    chrome.storage.sync.get(lists,
        (result) => {
            let updatedList = {}
            for (i = 0; i < lists.length; i++ ){
                updatedList = result[lists[i]];
                if (bools[i]) {
                    updatedList[url] = bools[i];
                } else {
                    delete updatedList[url];
                }
                values.lists[i] = updatedList;
            } 
        });
    chrome.storage.sync.set(values);
};

    chrome.storage.sync.set([item])

}
