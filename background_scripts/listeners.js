chrome.runtime.onInstalled.addListener(setDefaultStorage);

chrome.webRequest.onBeforeSendHeaders.addListener(bypassPaywallOnInitialLoad, {
  urls: ["<all_urls>"],
  types: ["main_frame"], }, 
  ["requestHeaders"]
);

chrome.tabs.onUpdated.addListener()