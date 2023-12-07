main()

function main () {
	header()
	content()
	footer()
}

function header () {
	$(".header").html("<div class='p-1 text-center'><img src='./images/512x512V.png' style='height: 50px;'><h4>創優土地資訊網</h4></div>")
}

async function content () {
	await post({ name: "temp" })
	browserInfo = getBrowser()
	installPrompt(browserInfo.system, browserInfo.supporter, browserInfo.shell)
	$(".content").html([
		formHTML("請輸入地段簡稱編號及選擇地段簡稱", [ inputHTML("lotAbbr") ]),
		formHTML("請輸入地段編號的數字部分", [ inputHTML("lotNum", "number") ]),
		btnHTML("chooseLot", "確認", "changeLot()"),
		"<div class='lotInfo py-1'></div>",
		"<div class='display py-1'></div>",
		adsHTML()
	].join(""))
	await initAutocompleteLotAbbr()
	await displayLotInfo()
    await initArcGIS(getLotID())
}

function footer () {
	$(".footer").addClass("d-none")
}