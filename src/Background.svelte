<script>
import browser from "webextension-polyfill";

function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " +
    request);
    function onGot(tabInfo) {
        console.log(tabInfo);
        let id = tabInfo[0].id
        browser.pageAction.setIcon({path: "./banano-icon.png", tabId: id});
        browser.pageAction.show(id);
      }
      
      function onError(error) {
        console.log(`Error: ${error}`);
      }


      let gettingCurrent = browser.tabs.query(
        {currentWindow: true, active : true},
      );
      gettingCurrent.then(onGot, onError);    


}
browser.runtime.onMessage.addListener(handleMessage);

</script>

<main>
      Test2
</main>