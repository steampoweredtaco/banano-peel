import browser from "webextension-polyfill";
import fetch from "node-fetch";

let bananofile = location.protocol.concat("//").concat(window.location.host).concat("/banano.json");
let banano_json;

function showBanActionPage(data)
{
    browser.runtime.sendMessage(data);
}

function waitForBanRequest(message, sender, response)
{
    console.log(message);
    if  (message.action === null || message.action !== 'send_address')
    {
        return;
    }
    console.log("returning");
    console.log(banano_json);
    response({address: banano_json.donate_address});
}
browser.runtime.onMessage.addListener(waitForBanRequest);

fetch(bananofile)
    .then(result => result.json())
    .then(json => {
        console.log(json);
        banano_json = json;
        showBanActionPage(json);
    })
    .catch(reason => {
        console.debug(reason);
        console.log("banano.json not found.");
    })
;

