console.log("content-script＠＠");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("msg", message);
  if (message.type === "EXECUTE_SCRIPT") {
    eval(message.script);
    sendResponse("script is executed.");
  } else if (message.type === "INSERT_CSS") {
    const styleId = "inserted-style";
    document.getElementById(styleId)?.remove();
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = message.css;
    document.head.appendChild(style);
  }
});

// dom content loadedで呼ばれる関数を定義
const onDOMContentLoaded = () => {
  console.log("onDOMContentLoaded");
};
// ページの読み込みが完了したらonDOMContentLoadedを実行
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
