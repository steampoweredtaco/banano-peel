<script>
	import QRCode from 'qrcode'
	import { onMount } from 'svelte';
	import browser from "webextension-polyfill";

	let ban_address;

	function handleMessage(request, sender, sendResponse) {
	console.log("page_action got: " +
		request);
		function onGot(address) {
			ban_address = address;
		}
		
		function onError(error) {
			console.log(`Error: ${error}`);
		}
		onGot(request.donate_address);
	}

	browser.runtime.onConnect.addListener(function(port) {
		console.assert(port.name === "ban_address");
		port.onMessage.addListener(handleMessage)
	});
	
	let canvas;

	function loadQR() {
		console.log(canvas);
		console.log(ban_address);
		QRCode.toCanvas(canvas, 'ban:'.concat(ban_address), function (error) {
		if (error) console.error(error)
		console.log('success!');
		});
	}

	function askForQR()
	{
		function onError(err)
		{
			console.error(err);
		}

		function onGot(tabInfo)
		{
			console.log("on got");
			let id = tabInfo[0].id
			
			return browser.tabs.sendMessage(id, {action: 'send_address'})
			.then(resp =>
			{
				console.log(resp);
				ban_address = resp.address;
			});
		}

		let gettingCurrent = browser.tabs.query(
        {currentWindow: true, active : true},
      	);
		console.log("prior to gettingCurrent");
      	return gettingCurrent.then(onGot, onError);    

	}

	onMount(() => {
		askForQR().then( function()
		{
			console.log("in postAskForQR");
			console.log(ban_address);
			console.log("calling loadQR");
			loadQR();
		}
		);
	}); 
</script>
  
  
<main>
Donate to: {ban_address}
</main>
  
<canvas
	bind:this={canvas}
	width={32}
	height={32}>
</canvas>