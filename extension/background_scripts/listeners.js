chrome.runtime.onInstalled.addListener(setDefaultStorage);

chrome.webRequest.onBeforeSendHeaders.addListener(bypassPaywallOnLoad, {
  urls: ["<all_urls>"],
  types: ["main_frame"], }, 
  ["requestHeaders", "blocking", "extraHeaders"]
);