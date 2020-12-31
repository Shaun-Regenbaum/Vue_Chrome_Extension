// This file contains the base functionality that our front-end can call
// There are 6 functions that all use the chrome api:
// 1) A function that manipulates the http headers to spoof as an adbot
// 2) a function that manipulates the http header to change the referring website
// 3) A function that blocks cookies
// 4) A function that enables cookies
// 5) A function that blocks javascript
// 6) A function that enables javascript

function adbotSpoof(http_details) {

    var google_adbot_UA = "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z‡ Safari/537.36"
    
    http_details.requestHeaders.push({
        "name": "User-Agent",
        "value": google_adbot_UA
    })
    
    http_details.requestHeaders.push({
        "name": "X-Forwarded-For",
        "value": "66.249.66.1"
    })

    console.log("Spoofing as Google Crawler")
    http_details.requestHeaders = http_details.requestHeaders.filter(function(header){
        if ( header.name === "User-Agent" || header.name === "X-Forwarded-For"){
            return false
        }
        return true
    })
}

function redirectReferer(http_details, referer = 'https://t.co/'){
    http_details.requestHeaders = http_details.requestHeaders.filter(function(header) {
        if(header.name === "Referer")
          return false
        return true
      })
      http_details.requestHeaders.push({
        "name": "Referer",
        "value": referer
      })
      console.log("Changed Header to Twitter")
}

function blockCookies(root_url){
    chrome.contentSettings.cookies.set({
        'primaryPattern': root_url,
        'setting': 'block'
      });
      console.log("Blocked Cookies")
}

function enableCookies(root_url){
    chrome.contentSettings.cookies.set({
        'primaryPattern': root_url,
        'setting': 'allow'
      });
      console.log("Enabled Cookies")
}

function blockJavascript(root_url){
    chrome.contentSettings.javascript.set({
        'primaryPattern': root_url,
        'setting': 'block'
    })
    console.log("Blocked Javascript")
}

function enableJavascript(root_url){
    chrome.contentSettings.javascript.set({
        'primaryPattern': root_url,
        'setting': 'allow'
    })
    console.log("Enabled Javascript")
}


