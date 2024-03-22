const connections: { [tabId: string]: chrome.runtime.Port } = {};

const sendMessage = (message: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("tabs", tabs);
    const tab = tabs[0];
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message, (msg) => {
        console.log("result message:", msg);
      });
    }
  });
};

chrome.runtime.onConnect.addListener(function (port) {
  const extensionListener: any = (
    message: any,
    sender: any,
    sendResponse: any
  ) => {
    console.log("message", message);
    if (message.type === "INIT") {
      connections[message.tabId] = port;
      return;
    } else if (message.type === "EXECUTE_SCRIPT") {
      sendMessage({
        type: "EXECUTE_SCRIPT",
        script: message.script,
      });
      return;
    } else if (message.type === "INSERT_CSS") {
      sendMessage({
        type: "INSERT_CSS",
        css: message.css,
      });
      return;
    } else {
      return;
    }
  };

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener);

    const tabs = Object.keys(connections);
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]];
        break;
      }
    }
  });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    const tabId: any = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});
