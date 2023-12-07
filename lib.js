function addFilesHTML () {
	return `
		<div id="images" class="pb-1"></div>
		<input class="d-none" type="file" accept=".jpg" onchange="imageChange($(this))" multiple>
		<button class="btn btn-primary add-image" onclick="$(this).prev().click()">加入 JPG 圖片</button>
	`
}

function adsHTML () {
	return `
		<div class="ads pt-3 pb-4">
			<h4>技術問題報告</h4>
			<div>WhatsApp電話：<a href="https://api.whatsapp.com/send/?phone=85267652544&text=創優網出現技術問題">67652544</a></div>
			<div>聯絡人：周先生</div>
			<div>公司名稱：創優網絡有限公司</div>
		</div>
	`
}

function align (element, horizontal, vertical="middle") {
	pair = {
		start: "e",
		center: "x",
		end: "s",
		top: "b",
		middle: "y",
		bottom: "t"
	}
	return "<div class='d-flex'><div class='m" + pair[horizontal] + "-auto m" + pair[vertical] + "-auto'>" + element + "</div></div>"
}

function appendImage (file, array) {
	return new Promise(function (resolve) {
		reader = new FileReader()
		reader.addEventListener("load", function () {
			arr = array
			arr.push(this.result)
			resolve(arr)
		})
		reader.readAsDataURL(file)
	})
}

function appendImages (files, index, array, s) {
	appendImage(files.item(index), array).then(function (arr) {
		if (index + 1 < files.length && index < 6) {
			appendImages(files, index + 1, arr, s)
		} else {
			displayImages(s, arr)
		}
	})
}

function arrToRGB (arr) {
	return "rgb(" + arr.join(", ") + ")"
}

function btnHTML (id, text, onclick, color="primary") {
	return "<button class=\"me-1 btn btn-" + color + "\" id=\"" + id + "\" onclick=\"" + onclick + "\">" + text + "</button>"
}

async function cancelSaleLease () {
	d = new Date()
	t = d.valueOf()
	await sqlUpdate("sale_lease", {
		expiry_date: t
	}, {
		lot_id: getLotID()
	})
	alert("已取消")
}

function changeLot () {
	$(".lotinfo, .display").html("")
	displayLot()
}

async function changePassword (newPassword, confirmPassword) {
	if (newPassword && newPassword == confirmPassword) {
		await post({
			name: "password",
			password: newPassword
		})
		alert("已更改密碼")
	} else {
		alert("密碼無效或不一致")
	}
}

function changePasswordPrompt () {
	$(".popup").remove()
	$(".wrapper").after(popupHTML("changePasswordPrompt", "更改密碼", [
		formHTML("密碼", [ inputHTML("password", "password") ]),
		formHTML("新密碼", [ inputHTML("newPassword", "password") ]),
		formHTML("確認新密碼", [ inputHTML("confirmPassword", "password") ]),
		btnHTML("initChangePassword", "更改", "initChangePassword()")
	].join("")))
}

function checkboxHTML (id, options, keys=Object.keys(options)) {
	html = ""
	for (key of keys) {
		option = options[key]
		html = html + `
			<div class="form-check form-check-inline">
				<input class="form-check-input" type="checkbox" name="` + id + `" value="` + key + `">` + option + `
			</div>
		`
	}
	return "<div id='" + id + "'>" + html + "</div>"
}

async function confirmSaleLease () {
	alert("請耐心等候")
	await post({
		name: "sale_lease",
		lotID: getLotID(),
		sale: $("#sale").val(),
		rent: $("#rent").val(),
		role: $("#role").val(),
		propNum: $("#propNum").val(),
		description: $("#description").val(),
		images: JSON.stringify(imageSelectorToArr($("#images")))
	})
	alert("已提交")
	$("#downloadReport").removeClass("d-none")
	$("#cancelSaleLease").removeClass("d-none")
}

function coordToDeg (x, y) {
	proj4.defs("EPSG:2326", "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs")
	return proj4("EPSG:2326", "EPSG:4326", [x, y]) // [long, lat]
}

function displayImages (s, images) {
	s.html(imageArrToHTML(images))
	w = $(".delete-image").width()
	s.find("img").css({ "max-width": w, "max-height": w })
	s.find(".image-wrapper").css({ width: w, height: w })
	$(".sortable").each(function () {
	    Sortable.create($(this)[0])
	})
	$(".delete-image").click(function () {
		$(this).parent().remove()
	})
}

async function displayLot () {
	lotsObj = await resolveLotJSON()
	sectionsObj = lotsObj[$("#lotAbbr").val()][$("#lotNum").val().toString()]
	if (sectionsObj) {
		keys = Object.keys(sectionsObj)
		if (keys.length == 1) {
			if (getLotID() == keys[0]) {
				$(".lotInfo").html(formHTML("請選擇分段編號", [ selectHTML("lotName", sectionsObj, keys) ]))
			} else {
				redirect(keys[0])
			}
		} else {
			keys.sort(function (key1, key2) {
				if (sectionsObj[key1] == sectionsObj[key2]) {
					return (key1 > key2) - 0.5
				} else {
					return (sectionsObj[key1] > sectionsObj[key2]) - 0.5
				}
			})
			$(".lotInfo").html(formHTML("請選擇分段編號", [ selectHTML("lotName", sectionsObj, keys) ]))
			$("#lotName").change(function () {
				redirect($(this).val())
			})
		}
	} else {
		$(".display").html("<div class='h1 text-center'>沒有相關土地</div>")
	}
}

async function displayLotInfo () {
	lotID = getLotID()
	if (lotID) {
		$(".display").html("<h2 class='text-center'>數據讀取中，請耐心等候。</h2>")
		lotRow = await resolveRow(lotID)
		$("#lotAbbr").val(lotRow.lot_name.split(" ")[0])
		$("#lotNum").val(Number(lotRow.lot_num))
		await displayLot()
		$("#lotName").val(lotID)
		lotRow.uses = await resolveLotUses(lotRow)
		lotPRN = lotRow.prn
		if (!lotPRN) {
		    lotPRN = "不存在"
		}
		lotRow.uses.sort(function (a, b) {
			if (a.use == "X") {
				return 1
			}
			if (b.use == "X") {
				return -1
			}
			return (a.area < b.area) - 0.5
		})
		files = []
		for (obj of lotRow.uses) {
			if (files.indexOf(obj.file) == -1 && obj.file) {
				files.push(obj.file)
			}
		}
		if (files.length > 0) {
			fileHTML = files.map(function (file) {
			//	doamin = new URL(url)
			//	domain = domain.hostname.replace('www.','')
			//	console.log(domain)
				return "<a href='./ozp/pdf/" + file + ".pdf'>按此下載</a>"
				//if (domain == "msnwk.com") {
				//	return "<a href='t.msnwk.com'> Please login to download</a>"
				//} else {
				//	return "<a href='./ozp/pdf/" + file + ".pdf'>按此下載</a>"
			//	}
			}).join("<br>")
		} else {
			fileHTML = "未規劃"
		}
		placesJSON = await get("./places.json")
		places = files.map(function (file) {
			return placesJSON[file]
		}).join(" / ")
		if (places) {
			placesHTML = "<div class='pb-3'><h4>地點</h4>" + places + "</div>"
		} else {
			placesHTML = ""
		}
		htmlMemorial = await memorialHTML(lotRow.memorial.split(", "))
		$(".display").html([
			`
				<div class="pb-3"><h4>土地資料</h4>` + fileHTML + `</div>
				` + placesHTML + `
				<div class="pb-3"><h4>物業參考編號</h4>` + lotPRN + `</div>
				<div>
					<h4>用途</h4>
					<div id="data" class="d-none">` + JSON.stringify(lotRow) + `</div>
					<div class="area pt-1"></div>
				</div>
				<div class="map py-4">
					<div class="mb-1 border border-dark" id="mapWrapper" style="width: 320px; height: 384px; position: relative; overflow: hidden;">
					<div id="map" style="width: 100%; height: 109.2%; position: absolute; top: 0; left: 0;">
					<div id="basemapToggle" ></div>
					</div>
				</div>
			`,
			htmlMemorial,
			landDocHTML(lotRow),
			btnHTML("share", "分享", "share($('#lotName').val())")
		].join(""))
	}
}

async function displayLotInfoNew (lotID) {
	if (lotID) {
		$(".display").html("<h2 class='text-center'>數據讀取中，請耐心等候。</h2>")
		lotRow = await resolveRow(lotID)
		$("#lotAbbr").val(lotRow.lot_name.split(" ")[0])
		$("#lotNum").val(Number(lotRow.lot_num))
		await displayLot()
		$("#lotName").val(lotID)
		await displayLotInfoPartial(lotID, lotRow)
	}
}

async function insertUserSearchRecord (lotID) {
	if (lotID) {

		await post({
			name: "insertUserSearchRecord",
			lotID: lotID
		})

	}
}



async function displayLotInfoPartial (lotID, lotRow) {
	if (lotID) {
		lotRow.uses = await resolveLotUses(lotRow)
		lotPRN = lotRow.prn
		if (!lotPRN) {
		    lotPRN = "不存在"
		}
		lotRow.uses.sort(function (a, b) {
			if (a.use == "X") {
				return 1
			}
			if (b.use == "X") {
				return -1
			}
			return (a.area < b.area) - 0.5
		})
		files = []
		for (obj of lotRow.uses) {
			if (files.indexOf(obj.file) == -1 && obj.file) {
				files.push(obj.file)
			}
		}
		if (files.length > 0) {
			fileHTML = files.map(function (file) {
				return "<a class='ozp' href='./ozp/pdf/" + file + ".pdf'>按此下載</a>"
			}).join("<br>")
		} else {
			fileHTML = "未規劃"
		}
		placesJSON = await get("./places.json")
		places = files.map(function (file) {
			return placesJSON[file]
		}).join(" / ")
		if (places) {
			placesHTML = "<div class='pb-3'><h4>地點: </h4><span id='places'>" + places + "</span></div>"
		} else {
			placesHTML = ""
		}
		htmlMemorial = await memorialHTML(lotRow.memorial.split(", "))
		$(".display").html([
			`
				<div class="pb-3"><h4>土地資料: </h4>` + fileHTML + `</div>
				` + placesHTML + `
				<div class="pb-3"><h4>物業參考編號: </h4><span id="lotPRN">` + lotPRN + `</span></div>
				<div class="pb-3">
					<h4>用途: </h4>
					<div id="data" class="d-none">` + JSON.stringify(lotRow) + `</div>
					<div class="area pt-1"></div>
				</div>
				<div class="map pb-3">
					<div class="mb-1 border border-dark" id="mapWrapper" style="width: 320px; height: 384px; position: relative; overflow: hidden;">
						<div id="map" style="width: 100%; height: 109.2%; position: absolute; top: 0; left: 0;">
						<div id="basemapToggle" ></div>
						</div>
						<div id="img" class="d-none"></div>
					</div>
				</div>
			`,
			htmlMemorial,
			landDocHTML(lotRow),
			btnHTML("share", "分享", "share($('#lotName').val())"),
			btnHTML("saleLease", "放盤", "saleLease()")
		].join(""))
	}
}

async function displaySaleRent (htmlArr) {
	$(".offers").html(htmlArr.join("<hr>"))
	$("#order input").click(function () {
		if ($(this).prop("checked")) {
			htmlArr.sort(function (htmlA, htmlB) {
				return (Number($(htmlA).find(".rate").text().replaceAll(",", "")) > Number($(htmlB).find(".rate").text().replaceAll(",", ""))) - 0.5
			})
			displaySaleRent(htmlArr)
		} else {
			htmlArr.sort(function (htmlA, htmlB) {
				return (Number($(htmlA).find(".price").text().replaceAll(",", "")) > Number($(htmlB).find(".price").text().replaceAll(",", ""))) - 0.5
			})
			displaySaleRent(htmlArr)
		}
	})
}

async function downloadPDF (contactNumber, surname, gender, cLicense, companyName, saleVal, rentVal, descriptionVal, images) {
	data = JSON.parse($("#data").text())
	coord = JSON.parse(data.coord)
	zone = data.zone
	prn = data.prn
	if (!prn) {
		prn = "不存在"
	}
	lotName = data.lot_name
	places = $("#places").text()
	if (saleVal) {
		sale = Number(saleVal).toLocaleString()
	} else {
		sale = "不適用"
	}
	if (rentVal) {
		rent = Number(rentVal).toLocaleString()
	} else {
		rent = "不適用"
	}
	if (companyName) {
		if (cLicense) {
			company = companyName + "（" + cLicense + "）"
		} else {
			company = companyName
		}
	} else {
		company = "不適用"
	}
	genderObj = { mr: "先生", ms: "小姐" }
	contactPerson = contactNumber.substr(4) + "（" + surname + genderObj[gender] + "）"
	if (descriptionVal) {
		description = descriptionVal
	} else {
		description = "-"
	}
	d = new Date()
	dateStr = d.getFullYear() + " 年 " + (d.getMonth() + 1) + " 月 " + d.getDate() + " 日"
	// CREATE PDF
	const { PDFDocument, rgb } = PDFLib
	fontBytes = await fetch("./NotoSansTC-Regular.otf").then(res => res.arrayBuffer())
	pdfDocA = await PDFDocument.create()
	pdfDocA.registerFontkit(fontkit)
	font = await pdfDocA.embedFont(fontBytes)
	// PAGE 1
	page1 = pdfDocA.addPage()
	pdfText(font, page1, "創優網絡有限公司 MY SPACE NETWORK LIMITED", 0, 20, 12)
	pdfText(font, page1, "土地報告 LAND REPORT", 0, 30, 36)
	pdfText(font, page1, "查詢日期", 25, 60, 18)
	pdfText(font, page1, dateStr, 60, 62, 12)
	pdfText(font, page1, "地段編號", 25, 75, 18)
	pdfText(font, page1, "地段：" + lotName + "；物業參考編號：" + prn, 60, 77, 12)
	pdfLine(page1, 25, 90, 185, 90)
	advertisement = "創優土地秘書（https://msnwk.com）\n> 查詢土地資料，包括地點、物業參考編號、用途、面積等；\n> 自動生成 PDF 土地報告，並與他人分享，展示盤源信息；及\n> 發佈放盤信息。\n \n創優線下服務\n> 土地測量；\n> 土地規劃及更改用途；\n> 土地平整、建設圍網等；\n> 土地合作發展，包括種植及養殖、露營及渡假營、停車場、建築等；及\n> 投資人或基金合作。\n \n聯繫電話\n> 68485288（李先生）"
	pdfText(font, page1, advertisement, 25, 105, 12)
	// PAGE 2
	page2 = pdfDocA.addPage()
	pdfText(font, page2, "創優網絡有限公司 MY SPACE NETWORK LIMITED", 0, 20, 12)
	pdfText(font, page2, "地段位置", 25, 30, 18)
	pdfText(font, page2, places, 60, 32, 12)
	await pdfImage(page2, pdfDocA, $("#img").text(), 25, 45)
	mmTop = 150
	$(".area > div").each(function () {
		pdfCircle(rgb, page2, $(this).find("div").css("background-color"), 30, mmTop + 6)
		use = []
		$(this).find("span").each(function () {
			use.push($(this).text())
		})
		pdfText(font, page2, use[0] + use[1], 45, mmTop, 12)
		pdfText(font, page2, use[2] + use[3] + use[4], 45, mmTop + 6, 12)
		mmTop = mmTop + 15
	})
	// PAGE 3
	page3 = pdfDocA.addPage()
	pdfText(font, page3, "創優網絡有限公司 MY SPACE NETWORK LIMITED", 0, 20, 12)
	pdfText(font, page3, "項目價錢", 25, 30, 18)
	pdfText(font, page3, "售價：" + sale + "；月租：" + rent, 60, 32, 12)
	pdfText(font, page3, "公司名稱", 25, 45, 18)
	pdfText(font, page3, company, 60, 47, 12)
	pdfText(font, page3, "聯繫電話", 25, 60, 18)
	pdfText(font, page3, contactPerson, 60, 62, 12)
	for (i = 0; i < images.length; i++) {
		await pdfImage(page3, pdfDocA, images[i], 25 + (i % 3) * 50, 75 + Math.floor(i / 3) * 50, 45)
	}
	pdfText(font, page3, "其他資料如下\n" + description, 25, 175, 12)
	// PAGE 4
	page4 = pdfDocA.addPage()
	pdfText(font, page4, "創優網絡有限公司 MY SPACE NETWORK LIMITED", 0, 20, 12)
	pdfText(font, page4, "使用聲明", 25, 30, 18)
	declaration = "創優網絡有限公司（下稱「本公司」）提供的資料只供參考之用，本公司不對上述資料的準確性或完整性作出任何保證。「本公司」所提供的土地數據、土地用途、法定圖則、圖則等資料，來源自多個的公開網站。由於資料都在註解中所提及的機構所獲取，而政府數據偶然出現延遲更新的情況，「本公司」不會就本報告所載資料的精確性或正確性作出任何保證，同時不會就本報告所載資料的精確性或正確性付上任何責任。\n \n就「本公司」直接或間接引起的任何損失或損害，「本公司」無須負責。「本公司」保留權利可隨時運用其絕對酌情決定權刪除或修改載於本報告的所有資料，無須給予任何理由，也無須事先通知。使用者有責任自行評估「本公司」所載的一切資料，並宜參閱相關資料的法定圖則或原始出處（下稱「資料原文」）以作核實，請留意「本公司」所載的圖則在繪製方面與「資料原文」所載的不一定完全一樣。\n \n此外，「本公司」提供的內容，均受版權保障。除非預先取得有關的版權擁有人的書面授權，否則嚴禁複製、改編、分發、發布或向公眾提供該等版權作品。凡有意申請使用「本公司」的任何材料，請與我們聯絡，電話號碼為68485288（李先生）。"
	pdfText(font, page4, declaration, 60, 32, 12, 125)
	// OUTLINE ZONING PLAN
	arrayBuffer = await fetch("./ozp/pdf/" + zone + ".pdf").then(res => res.arrayBuffer())
	pdfDocB = await PDFDocument.load(arrayBuffer)
	// MERGE
	pdfDoc = await PDFDocument.create()
	pagesA = await pdfDoc.copyPages(pdfDocA, pdfDocA.getPageIndices())
	pagesA.forEach(page => pdfDoc.addPage(page))
	pagesB = await pdfDoc.copyPages(pdfDocB, pdfDocB.getPageIndices())
	pagesB.forEach(page => pdfDoc.addPage(page))
	// DOWNLOAD
	pdfBytes = await pdfDoc.save()
	a = $("<a class='d-none'></a>")
	url = URL.createObjectURL(new Blob([ pdfBytes ], { type: "application/pdf" }))
	a.attr("href", url)
	a.attr("download", lotName + ".pdf")
	$("body").append(a)
	a[0].click()
	URL.revokeObjectURL(url)
	a.remove()
}

async function downloadPriceInfo (s) {
	alert("請耐心等候")
	lotID = s.attr("id")
	lotRow = await resolveRow(lotID)
	$(".content").append("<div class='display' style='position: absolute; left: 100vw'></div>")
	await displayLotInfoPartial(lotID, lotRow)
	await initArcGIS(lotID, async function () {
		allData = JSON.parse(s.find(".allData").text())
		contactNumber = allData.id.split(" / ")[0]
		account = await sqlSelect("account", {
			id: contactNumber
		})
		surname = account[0].surname
		gender = account[0].gender
		cLicense = account[0].c_license
		companyName = account[0].company_name
		saleVal = allData.sale
		rentVal = allData.rent
		descriptionVal = allData.description
		images = JSON.parse(allData.images)
		await downloadPDF(contactNumber, surname, gender, cLicense, companyName, saleVal, rentVal, descriptionVal, images)
		$(".display").remove()
	})
}

async function downloadReport () {
	contactNumber = await session("mobile")
	surname = await session("surname")
	gender = await session("gender")
	cLicense = await session("cLicense")
	companyName = await session("companyName")
	saleVal = $("#sale").val()
	rentVal = $("#rent").val()
	descriptionVal = $("#description").val()
	images = imageSelectorToArr($("#images"))
	await downloadPDF(contactNumber, surname, gender, cLicense, companyName, saleVal, rentVal, descriptionVal, images)
}

async function forgetPassword () {
	mobile = "+852" + $("#mobile").val()
	password = $("#password").val()
	count = await post({ name: "check", mobile: mobile })
	if (count == "1") {
		await verifyMobile(mobile, password, "", "", "", "", "")
	} else {
		alert("沒有這個用戶")
	}
}

function formHTML (label, elements) {
	return `
		<div class="pb-1">
			<label>` + label + `</label>
			<div class="input-group">` + elements.join("") + `</div>
		</div>
	`
}

function get (url) {
	return new Promise(function (resolve) {
		$.get(url, function (response) {
			resolve(response)
		})
	})
}

function getBrowser () {
	system = "unknown"
	if (testUA(/windows|win32|win64|wow32|wow64/ig)) {
		system = "windows"
	} else if (testUA(/macintosh|macintel/ig)) {
		system = "macos"
	} else if (testUA(/x11/ig)) {
		system = "linux"
	} else if (testUA(/android|adr/ig)) {
		system = "android"
	} else if (testUA(/ios|iphone|ipad|ipod|iwatch/ig)) {
		system = "ios"
	}
	supporter = "unknown"
	if (testUA(/applewebkit/ig) && testUA(/safari/ig)) {
		if (testUA(/edge/ig)) {
			supporter = "edge"
		} else if (testUA(/opr/ig)) {
			supporter = "opera"
		} else if (testUA(/chrome/ig)) {
			supporter = "chrome"
		} else {
			supporter = "safari"
		}
	} else if (testUA(/gecko/ig) && testUA(/firefox/ig)) {
		supporter = "firefox"
	} else if (testUA(/presto/ig)) {
		supporter = "opera"
	} else if (testUA(/trident|compatible|msie/ig)) {
		supporter = "iexplore"
	}
	shell = "none";
	if (testUA(/micromessenger/ig)) {
		shell = "wechat"
	} else if (testUA(/qqbrowser/ig)) {
		shell = "qq"
	} else if (testUA(/ucbrowser/ig)) {
		shell = "uc"
	} else if (testUA(/2345explorer/ig)) {
		shell = "2345"
	} else if (testUA(/metasr/ig)) {
		shell = "sogou"
	} else if (testUA(/lbbrowser/ig)) {
		shell = "liebao"
	} else if (testUA(/maxthon/ig)) {
		shell = "maxthon"
	} else if (testUA(/baidubrowser/ig)) {
		shell = "baidu"
	}
	return { system: system, supporter: supporter, shell: shell }
}

function getCurrentTime () {
	d = new Date()
	e = new Date(d.valueOf() + 28800000)
	iso = e.toISOString()
	return iso.substr(0, 10) + " " + iso.substr(11, 8)
}

function getFeatureCoord (feature) {
	return feature.geometry.coordinates
}

function getFeatureUse (feature) {
	usesAvailable = [ "AGR", "C", "CA", "CDA", "CP", "CPA", "G/IC", "GB", "I", "I(D)", "O", "OS", "OU", "R(A)", "R(B)", "R(C)", "R(D)", "R(E)", "REC", "SSSI", "V", "X" ]
	result = feature.properties.ZONE_LABEL
	for (i = usesAvailable.length - 1; i >= 0; i--) {
		if (result.indexOf(usesAvailable[i]) == 0) {
			return usesAvailable[i]
		}
	}
	return "OU"
}

function getLotID () {
	queryString = window.location.search
	urlParams = new URLSearchParams(queryString)
	lotID = urlParams.get("q")
	return lotID
}

function imageArrToHTML (arr) {
	html = ""
	arr.forEach(function (str) {
		html = html + `
			<div class="col-2 mb-1">
				<div class="image-wrapper d-flex">
					<img class="mx-auto mt-auto" src="` + str + `" onclick="imageClick($(this))">
				</div>
				<div class="text-primary text-center delete-image" style="cursor: pointer;">刪除</div>
			</div>
		`
	})
	return "<div class='row sortable'>" + html + "</div><div class='modal-wrapper' style='cursor: pointer;' onclick='modalClick($(this))'><img class='modal-content'></div>"
}

function imageChange (s) {
	appendImages(s[0].files, 0, imageSelectorToArr(s.prev()), s.prev())
}

function imageClick (s) {
	src = s.attr("src")
	$(".modal-wrapper").removeClass("d-none")
	$(".modal-wrapper").addClass("d-flex")
	$(".modal-content").attr("src", src)
	$(".modal-content").css({ "max-width": "", "max-height": "" })
}

function imageSelectorToArr (s) {
	arr = []
	s.find(".image-wrapper img").each(function () {
		arr.push($(this).attr("src"))
	})
	return arr
}

async function initArcGIS (lotID, callback=function(){}) {
	if (lotID) {
		colors = [
			{ color: [ 148, 252, 52 ], useEN: "AGR", useZH: "農業" },
			{ color: [ 244, 76, 76 ], useEN: "C", useZH: "商業" },
			{ color: [ 148, 148, 20 ], useEN: "CA", useZH: "自然保育區" },
			{ color: [ 244, 20, 28 ], useEN: "CDA", useZH: "綜合發展區" },
			{ color: [ 236, 252, 15 ], useEN: "CP", useZH: "郊野公園" },
			{ color: [ 204, 252, 20 ], useEN: "CPA", useZH: "海岸保護區" },
			{ color: [ 186, 252, 252 ], useEN: "G/IC", useZH: "政府、機構或社區" },
			{ color: [ 204, 252, 148 ], useEN: "GB", useZH: "綠化地帶" },
			{ color: [ 228, 12, 180 ], useEN: "I", useZH: "工業" },
			{ color: [ 252, 132, 204 ], useEN: "I(D)", useZH: "工業(丁類)" },
			{ color: [ 84, 252, 20 ], useEN: "O", useZH: "休憩用地" },
			{ color: [ 189, 18, 88 ], useEN: "OS", useZH: "露天貯物" },
			{ color: [ 252, 180, 12 ], useEN: "OU", useZH: "其他用途" },
			{ color: [ 150, 24, 16 ], useEN: "R(A)", useZH: "住宅(甲類)" },
			{ color: [ 188, 108, 12 ], useEN: "R(B)", useZH: "住宅(乙類)" },
			{ color: [ 228, 180, 28 ], useEN: "R(C)", useZH: "住宅(丙類)" },
			{ color: [ 252, 220, 12 ], useEN: "R(D)", useZH: "住宅(丁類)" },
			{ color: [ 172, 20, 36 ], useEN: "R(E)", useZH: "住宅(戊類)" },
			{ color: [ 148, 156, 12 ], useEN: "REC", useZH: "康樂" },
			{ color: [ 204, 252, 148 ], useEN: "SSSI", useZH: "具特殊科學價值地點" },
			{ color: [ 196, 180, 12 ], useEN: "V", useZH: "鄉村式發展" },
			{ color: [ 228, 228, 236 ], useEN: "X", useZH: "未規劃"}
		]
		allLotData = JSON.parse($("#data").text())
		lotUses = allLotData.uses
		x = []
		y = []
		for (lotUse of lotUses) {
			for (polygon of lotUse.coord) {
				for (boundary of polygon) {
					for (pair of boundary) {
						x.push(pair[0])
						y.push(pair[1])
					}
				}
			}
		}
		xMax = Math.max(...x)
		yMax = Math.max(...y)
		xMin = Math.min(...x)
		yMin = Math.min(...y)
		range = Math.max(xMax - xMin, yMax - yMin)
		center = coordToDeg((xMax + xMin) / 2, (yMax + yMin) / 2)
		require([ "esri/config", "esri/Map", "esri/views/MapView",  "esri/widgets/BasemapToggle", "esri/Graphic", "esri/layers/GraphicsLayer" , "esri/core/reactiveUtils"], 
		function (Config, Map, MapView, BasemapToggle, Graphic, GraphicsLayer, reactiveUtils) {
			Config.apiKey = "AAPK8906c7f81d6f43e5949c2067438c27fbm4mKr4mkRrCbz1jArzSUZmUXmOkNv0GyICbkqYMgjmApNgjh0fskkNNyoIPu5dFh"
			map = new Map({
				basemap: {
					portalItem: {
						id: "859ce87f283b49898b1022aeee4e6c1d"
					}
				}
			})
			view = new MapView({
				map: map,
				center: center,
				zoom: Math.floor(25 - Math.log2(range)),
				container: "map"
			})

/*			basemapGallery = new BasemapGallery({
				view: view,
			showArcGISBasemaps: true
				
			}, "basemapGallery")
			// Add widget to the top right corner of the view
			view.ui.add(basemapGallery, {
			position: "top-right"
			})
			basemapGallery.startup()
*/			
			
			basemapToggle = new BasemapToggle({
				
				//basemap: "satellite",
				//nextBasemap: "osm",
				//nextBasemap: "hybrid",
				nextBasemap: {
					portalItem: {
						//id: "588017d704814accb67b20bae75074e4"
						id: "ff52218580f94d89851563f50cd1a2b2"
						//id: "7ba5fedbafb747ec9d50e61b55ca0844"
					}
				},
				//basemap: "osm",
				view: view,
				//container: "map",
				visible: true,
			  }, "basemapToggle")

			
			
			  



			graphicsLayer = new GraphicsLayer()
			map.add(graphicsLayer)
			colorObjs = []
			for (lotUse of lotUses) {
				colorObj = null
				for (color of colors) {
					if (color.useEN == lotUse.use) {
						colorObj = color
						colorObj.area = lotUse.area
						colorObjs.push(colorObj)
						break
					}
				}
				for (polygon of lotUse.coord) {
					paths = polygon.map(function (boundary) {
						return boundary.map(function (pair) {
							return coordToDeg(...pair)
						})
					})
					shape = {
						type: "polygon",
						rings: paths
					}
					simpleFillSymbol = {
						type: "simple-fill",
						color: colorObj.color.concat([ 0.5 ])
					}
					polygonGraphic = new Graphic({
						geometry: shape,
						symbol: simpleFillSymbol
					})
					graphicsLayer.add(polygonGraphic)
				}
			}
			html = ""
			colorsMentioned = [ ...new Set(colorObjs) ]
			colorsMentioned.sort(function (obj1, obj2) {
				return (obj1.useEN > obj2.useEN) - 0.5
			})
			for (colorMentioned of colorsMentioned) {
				if (colorMentioned.useEN == "X") {
					colorHTML = "<span>未規劃</span>"
				} else {
					colorHTML = "<span>" + colorMentioned.useZH + " </span><span>" + colorMentioned.useEN + "</span>"
				}
				html = html + `
					<div>
						<div class="me-1" style="float: left; height: 25px; width: 25px; clear: both; background-color: ` + arrToRGB(colorMentioned.color) + `;"></div>` + colorHTML + `
						<br>
						<span>面積 </span>
						<span>` + colorMentioned.area.toFixed(1) + ` 平方米 </span>
						<span>(` + (colorMentioned.area / 0.09290304).toFixed(0) + ` 平方呎)</span>
					</div>
				`
			}
			reactiveUtils.whenOnce(function () {
				return !view.updating
			}).then(function () {
				return view.takeScreenshot({
					format: "jpg"
				})
			}).then(function (screenshot) {
				$("#img").text(screenshot.dataUrl)		
				$(".area").html(html)
				callback()
			})
		})
	}
}

async function initAutocompleteLotAbbr () {
	$("#lotAbbr").prop("disabled", true)
	lotsObj = await resolveLotJSON()
	lotAbbr = Object.keys(lotsObj)
	lotAbbr.sort()
	$("#lotAbbr").autocomplete({
		source: lotAbbr
	})
	$("#lotAbbr").prop("disabled", false)
}

function initChangePassword () {
	changePassword($("#newPassword").val(), $("#confirmPassword").val())
}

function initUpdateAccount () {
	updateAccount($("#surname").val(), $("#gender").val(), $("#esLicense").val(), $("#cLicense").val(), $("#companyName").val())
}

function inputHTML (id, type, placeholder="") {
	return "<input class='form-control' id='" + id + "' type='" + type + "' placeholder='" + placeholder + "'>"
}

function installPrompt (system, supporter, shell) {
	if (system == "windows" || system == "android") {
		if (supporter == "chrome" && shell == "none") {
			window.addEventListener("beforeinstallprompt", function (e) {
				e.preventDefault()
				deferredPrompt = e
				$(".content").after(popupHTML("installTutor", "下載創優APP", align(btnHTML("install", "下載", ""), "center")))
				$("#install").click(function () {
					$("#installTutor").remove()
					deferredPrompt.prompt()
					deferredPrompt.userChoice.then(function () {
						deferredPrompt = null
					})
				})
			})
		} else {
			alert("請使用Chrome下載創優APP");
		}
	}
	if (system == "macos" || system == "ios") {
		if (supporter == "safari" && shell == "none") {
			if (!window.navigator.standalone) {
				$(function () {
					$(".content").after(popupHTML("installTutor", "下載創優APP", `
						<ol>
							<li>按 <img src="./images/share.png" style="height: 1rem; padding-bottom: 0.2rem;"></li>
							<li>按「加至主畫面」</li>
							<li>按「新增」</li>
						</ol>
					`))
				})
			}
		} else {
			alert("請使用Safari下載創優APP")
		}
	}
}

function landDocHTML (row) {
	if (row.tree) {
		return `
			<div class="py-3"><h4>樹木保育條款</h4><span id="tree">` + translateYesNo(row.tree) + `</span></div>
			<div class="pb-3"><h4>建築物類型限制</h4><span id="buildingType">` + translateYesNo(row.building_type) + `</span></div>
			<div class="pb-3"><h4>單位數量限制</h4><span id="numOfUnits">` + translateYesNo(row.num_of_units) + `</span></div>
			<div class="pb-3"><h4>單位面積限制</h4><span id="unitSize">` + translateYesNo(row.unit_size) + `</span></div>
			<div class="pb-3"><h4>設計 / 規劃 / 高度條款</h4><span id="ddh">` + translateYesNo(row.ddh) + `</span></div>
			<div class="pb-3"><h4>公共休憩用地規定</h4><span id="public">` + translateYesNo(row.public) + `</span></div>
			<div class="pb-3"><h4>提供政府地方規定</h4><span id="gov">` + translateYesNo(row.gov) + `</span></div>
			<div class="pb-3"><h4>運作需達致主管當局滿意規定</h4><span id="satisfaction">` + translateYesNo(row.satisfaction) + `</span></div>
			<div class="pb-3"><h4>轉讓限制</h4><span id="alienation">` + translateYesNo(row.alienation) + `</span></div>
			<div class="pb-3"><h4>非牟利限制</h4><span id="profit">` + translateYesNo(row.profit) + `</span></div>
			<div class="pb-3"><h4>提交賬目要求</h4><span id="accounting">` + translateYesNo(row.accounting) + `</span></div>
			<div class="pb-3"><h4>不容許利潤分配限制</h4><span id="profitDistribution">` + translateYesNo(row.profit_distribution) + `</span></div>
			<div class="pb-3"><h4>終止或縮減土地用途條件</h4><span id="cassation">` + translateYesNo(row.cassation) + `</span></div>
		`
	} else {
		return ""
	}
}

function login () {
	post({
		name: "login",
		mobile: "+852" + $("#mobile").val(),
		password: $("#password").val()
	}).then(function (response) {
		if (response.length == 4) {
			alert(response)
		} else {
		    location.reload()
		}
	})
}

function loginPrompt () {
	$(".popup").remove()
	$(".wrapper").after(popupHTML("loginPrompt", "登入", [
		formHTML("手機 (例: 66666666)", [ inputHTML("mobile", "text") ]),
		formHTML("密碼", [ inputHTML("password", "password") ]),
		btnHTML("login", "登入", "login()"),
		btnHTML("forget", "忘記密碼", "forget()"),
		btnHTML("register", "註冊", "registerPrompt()"),
		"<div id='recaptcha'></div>"
	].join("")))
}

function logout () {
	post({ name: "logout" }).then(function () {
		location.href = "./"
	})
}

function margin (direction) {
	if (direction == "x") {
		return "<span class='pe-1'></span>"
	}
	if (direction == "y") {
		return "<span class='pb-1'></span>"
	}
}

async function memorialHTML (idArr) {
	rows = []
	for (id of idArr) {
		if (id) {
			row = await sqlSelect("memorial", {
				id: id
			})
			rows.push(row[0])
		}
	}
	rows.sort(function (a, b) {
		if (a.instrument_date == b.instrument_date) {
			return (a.id > b.id) - 0.5
		} else {
			return (a.instrument_date < b.instrument_date) - 0.5
		}
	})
	html = ""
	for (obj of rows) {
		if (obj.consideration) {
			consideration = "(" + obj.consideration + ")"
		} else {
			consideration = ""
		}
		html = html + `
			<div class="py-2">
				<div class="h5 mb-0">` + obj.id + `</div>
				<div>` + obj.instrument_date.substr(0, 4) + " 年 " + Number(obj.instrument_date.substr(4, 2)).toString() + " 月 " + Number(obj.instrument_date.substr(6, 2)).toString() + " 日" + `</div>
				<div>` + obj.nature + `</div>
				<div>` + consideration + `</div>
			</div>
		`
	}
	if (html) {
		return "<div><h4>土地註冊摘要</h4><div id='memorial'>" + html + "</div></div>"
	} else {
		return ""
	}
}

function modalClick (s) {
	s.removeClass("d-flex")
	s.addClass("d-none")
}

function multiPolygonArea (coord) {
    area = 0
    for (polygon of coord) {
        polygonArea = 2 * simplePolygonArea(polygon[0])
        for (simplePolygon of polygon) {
            polygonArea = polygonArea - simplePolygonArea(simplePolygon)
        }
        area = area + polygonArea
    }
    return area
}

function pageNum () {
	path = location.pathname.split("/")
	result = path[path.length - 1].split(".")[0]
	if (result == "index" || result == "") {
		return "1"
	} else {
		return result
	}
}

function pdfCircle (rgb, page, code, mmLeft, mmTop) {
	// code = "rgb(R, G, B)"
	rgbArr = code.substr(4, code.length - 5).split(", ").map(function (str) {
		return Number(str) / 255
	})
	page.drawCircle({
		x: mmLeft * 595.28 / 210,
		y: (297 - mmTop) * 841.89 / 297,
		size: 12,
		color: rgb(...rgbArr)
	})
}

async function pdfImage (page, doc, url, mmLeft, mmTop, mmMax=1000) {
	jpgBytes = await fetch(url).then((res) => res.arrayBuffer())
	jpg = await doc.embedJpg(jpgBytes)
	dimInit = jpg.scale(1)
	max = mmMax * 595.28 / 210
	dim = jpg.scale(Math.min(max / dimInit.width, max / dimInit.height, 1))
	page.drawImage(jpg, {
		x: mmLeft * 595.28 / 210,
		y: (297 - mmTop) * 841.89 / 297 - dim.height,
		width: dim.width,
		height: dim.height
	})
}

function pdfLine (page, mmFromX, mmFromY, mmToX, mmToY) {
	page.drawLine({
		start: {
			x: mmFromX * 595.28 / 210,
			y: (297 - mmFromY) * 841.89 / 297
		},
		end: {
			x: mmToX * 595.28 / 210,
			y: (297 - mmToY) * 841.89 / 297
		}
	})
}

function pdfText (font, page, text, mmLeft, mmTop, fontSize, maxWidth=160) {
	if (mmLeft > 0) {
		textHeight = font.heightAtSize(fontSize)
		page.drawText(text, {
			x: mmLeft * 595.28 / 210,
			y: (297 - mmTop) * 841.89 / 297 - textHeight,
			font: font,
			size: fontSize,
			maxWidth: maxWidth * 595.28 / 210,
			wordBreaks: [ "" ]
		})
	} else {
		textWidth = font.widthOfTextAtSize(text, fontSize)
		textHeight = font.heightAtSize(fontSize)
		page.drawText(text, {
			x: (595.28 - textWidth) / 2,
			y: (297 - mmTop) * 841.89 / 297 - textHeight,
			font: font,
			size: fontSize
		})
	}
}

function popupHTML (id, title, content) {
	return `
    	<div class="popup border border-primary p-3" id="` + id + `" style="width: 375px; background-color: white; top: 50%; left: 50%; transform: translate(-50%, -50%); position: fixed;">
			<div class="d-flex justify-content-between">
				<b class="text-white">&#10005;</b>
				<div class="h3">` + title + `</div>
				<b style="cursor: pointer;" onclick="$(this).parents('.popup').remove()">&#10005;</b>
			</div>
			` + content + `
		</div>
	`
}

function post (data) {
	return new Promise(function (resolve) {
		$.post("./ajax.php", data, function (response) {
			resolve(response)
		})
	})
}

function redirect (q) {
	queryString = location.search
	location.href = location.href.replace(queryString, "") + "?q=" + q
}

async function register () {
	if ($("#terms input").prop("checked")) {
		mobile = "+852" + $("#mobile").val()
		password = $("#password").val()
		surname = $("#surname").val()
		gender = $("#gender").val()
		esLicense = $("#esLicense").val()
		cLicense = $("#cLicense").val()
		companyName = $("#companyName").val()
		count = await post({ name: "check", mobile: mobile })
		if (count == "0") {
			await verifyMobile(mobile, password, surname, gender, esLicense, cLicense, companyName)
		} else {
			alert("已註冊")
		}
	} else {
		alert("請確認同意服務條款")
	}
}

function registerPrompt () {
	$(".popup").remove()
	$(".wrapper").after(popupHTML("registerPrompt", "註冊", [
		formHTML("手機 (例: 66666666)", [ inputHTML("mobile", "text") ]),
		formHTML("密碼", [ inputHTML("password", "password") ]),
		formHTML("聯絡人", [ inputHTML("surname", "text", "姓氏"), selectHTML("gender", { mr: "先生", ms: "小姐"}) ]),
		formHTML("選填 E 或 S 牌號碼 (例: E-123456)", [ inputHTML("esLicense", "text") ]),
		formHTML("選填 C 牌號碼 (例: C-123456)", [ inputHTML("cLicense", "text") ]),
		formHTML("選填公司名稱", [ inputHTML("companyName", "text") ]),
		checkboxHTML("terms", { agree: "確認同意<a class='text-decoration-none' href='./terms.pdf'>服務條款</a>" }),
		btnHTML("register", "註冊", "register()"),
		"<div id='recaptcha'></div>"
	].join("")))
}

async function resolveLotJSON () {
	result = await get("./list.json")
	return result
}

async function resolveLotUses (row) {
	result = []
	coord = JSON.parse(row.coord)
	area = multiPolygonArea(coord)
	unallocated = turf.multiPolygon(coord)
	files = row.zone.split(", ")
	for (file of files) {
		if (file) {
			zone = await get("./ozp/zones/" + file + ".json")
			for (feature of zone.ZONE.features) {
				featureCoord = getFeatureCoord(feature)
				if (feature.geometry.type == "Polygon") {
					featureMultiPoly = turf.multiPolygon([ featureCoord ])
				} else {
					featureMultiPoly = turf.multiPolygon(featureCoord)
				}
				try {
					intersection = turf.intersect(featureMultiPoly, unallocated)
				} catch (e) {
					continue
				}
				if (intersection) {
					if (intersection.geometry.type == "Polygon") {
						coord = [ turf.getCoords(intersection) ]
					} else {
						coord = turf.getCoords(intersection)
					}
					unallocated = turf.difference(unallocated, intersection)
					area = multiPolygonArea(coord)
					if (area >= 0.05) {
						result = result.concat([{
							coord: coord,
							file: file,
							area: area,
							use: getFeatureUse(feature)
						}])
					}
					if (!unallocated) {
						break
					}
				}
			}
			if (!unallocated) {
				break
			}			
		}
	}
	if (unallocated) {
		if (unallocated.geometry.type == "Polygon") {
			unallocatedCoord = [ turf.getCoords(unallocated) ]
		} else {
			unallocatedCoord = turf.getCoords(unallocated)
		}
		unallocatedArea = multiPolygonArea(unallocatedCoord)
		if (unallocatedArea >= 0.05) {
			result = result.concat([{
				coord: unallocatedCoord,
				file: "",
				area: unallocatedArea,
				use: "X"
			}])
		}

	}
	return result
}

async function resolveRow (lotID) {
	lotInfo = await sqlSelect("lot_info", {
		id: lotID
	})
	lot = await sqlSelect("lot", {
		id: lotID
	})
	result = lotInfo[0]
	result.lot_name = lot[0].lot_name
	return result
}

async function saleLease () {
	mobile = await session("mobile")
	if (mobile) {
		esLicense = await session("esLicense")
		if (esLicense) {
			roles = { owner: "地主", agent: "代理", soleAgent: "獨家代理" }
		} else {
			roles = { owner: "地主", representative: "地主代表" }
		}
		$(".popup").remove()
		$(".wrapper").after(popupHTML("saleLeasePrompt", "放盤", [
			formHTML("價錢", [ inputHTML("sale", "number", "售價"), inputHTML("rent", "number", "月租") ]),
			formHTML("身份", [ selectHTML("role", roles) ]),
			formHTML("代理物業編號", [ inputHTML("propNum", "text") ]),
			formHTML("描述", [ textareaHTML("description") ]),
			addFilesHTML(),
			btnHTML("confirmSaleLease", "確認", "confirmSaleLease()"),
			btnHTML("downloadReport", "下載PDF", "downloadReport()"),
			btnHTML("cancelSaleLease", "取消", "cancelSaleLease()")
		].join("")))
		$("#downloadReport").addClass("d-none")
		$("#cancelSaleLease").addClass("d-none")
		if (!esLicense) {
			$("#propNum").parent().parent().addClass("d-none")
		}
		$("#cancelSaleLease").removeClass("btn-primary")
		$("#cancelSaleLease").addClass("btn-danger")
		rows = await sqlSelect("sale_lease", {
			lot_id: getLotID()
		})
		rowsFiltered = rows.filter(function (row) {
			return (row.id.indexOf(mobile) == 0)
		})
		if (rowsFiltered.length > 0 && !rowsFiltered[rowsFiltered.length - 1].expiry_date) {
			row = rowsFiltered[rowsFiltered.length - 1]
			$("#sale").val(row.sale)
			$("#rent").val(row.rent)
			$("#role").val(row.role)
			$("#propNum").val(row.prop_num)
			$("#description").val(row.description)
			displayImages($("#images"), JSON.parse(row.images))
			$("#downloadReport").removeClass("d-none")
			$("#cancelSaleLease").removeClass("d-none")
		}
	} else {
		loginPrompt()
	}
}

async function saveRecord (id, action) {
	await post({
		name: "record",
		time: getCurrentTime(),
		id: id,
		action: action
	})
}

function selectChange (s) {
	$("." + s.attr("id")).addClass("d-none")
	$("." + s.val()).removeClass("d-none")
}

function selectHTML (id, options, keys=Object.keys(options)) {
	if (keys.length == 1) {
		key = keys[0]
		return "<select class='form-control' id='" + id + "'><option value='" + key + "'>" + options[key] + "</option></select>"
	} else {
		html = "<option value=''>請選擇</option>"
		for (key of keys) {
			html = html + "<option value='" + key + "'>" + options[key] + "</option>"
		}
		return "<select class='form-control' id='" + id + "'>" + html + "</select>"
	}
}

async function session (key, val=null) {
	result = await post({
		name: "session",
		key: key,
		val: val
	})
	return result
}

function share (text) {
	navigator.share({
		title: "MDN",
		text: text,
		url: location.href
	})
}

function signatureHTML () {
	return `
		<div class="d-flex align-items-start">
			<canvas class="border" id="signature" style="width: 250px; height: 125px;"></canvas>
			<b class="ps-2" id="clear" style="cursor: pointer;">&#10005;</b>
		</div>
	`
}

function simplePolygonArea (coord) {
    sum = 0
    for (i = 1; i < coord.length; i++) {
        sum = sum + coord[i - 1][0] * coord[i][1] - coord[i - 1][1] * coord[i][0]
    }
    return Math.abs(sum) / 2
}

async function sqlSelect (table, conditions) {
    result = await post({
        name: "select",
        table: table,
        conditions: JSON.stringify(conditions)
    })
    return JSON.parse(result)
}

async function sqlUpdate (table, params, conditions={}) {
    test = await post({
        name: "update",
        table: table,
        params: JSON.stringify(params),
        conditions: JSON.stringify(conditions)
    })
	return test
}

function tabHTML (page, text) {
	if (pageNum().indexOf(page) == 0) {
		fontWeight = "1000"
		opacity = "1"
	} else {
		fontWeight = "500"
		opacity = "0.5"
	}
	//return "<a style='cursor: pointer; text-decoration: none; color: black; font-weight: " + fontWeight + "; opacity: " + opacity + ";' href='./" + page + ".php'>" + text + "</a>"
	return "<a style='cursor: pointer; text-decoration: none; color: black; font-weight: " + fontWeight + "; opacity: " + opacity + ";' href='./" + page + ".php'>" + text + "</a>"
}

function tabsHTML (pageObjects) {
	return `
		<div class="row mx-0 my-0 py-0 rounded bg-primary bg-opacity-25">
			<div class="col-3 text-center">` + tabHTML(pageObjects[0].page, pageObjects[0].text) + `</div>
			<div class="col-3 text-center">` + tabHTML(pageObjects[1].page, pageObjects[1].text) + `</div>
			<div class="col-3 text-center">` + tabHTML(pageObjects[2].page, pageObjects[2].text) + `</div>
			<div class="col-3 text-center">` + tabHTML(pageObjects[3].page, pageObjects[3].text) + `</div>
			<div class="col-3 text-center">` + tabHTML(pageObjects[4].page, pageObjects[4].text) + `</div>
		</div>
	`
}

function testUA (regexp) {
	return regexp.test(navigator.userAgent.toLowerCase())
}

function textareaHTML (id, placeholder="") {
	return "<textarea class='form-control' id='" + id + "' rows='5' placeholder='" + placeholder + "'></textarea>"
}

function translateYesNo (eng) {
	if (eng == "Yes") {
		return "有"
	}
	if (eng == "No") {
		return "沒有"
	}
}

async function updateAccount (surname, gender, esLicense, cLicense, companyName) {
	await sqlUpdate("account", {
		surname: surname,
		gender: gender,
		es_license: esLicense,
		c_license: cLicense,
		company_name: companyName
	})
	await session("surname", surname)
	await session("gender", gender)
	await session("esLicense", esLicense)
	await session("cLicense", cLicense)
	await session("companyName", companyName)
	alert("已更新")
}

async function verifyMobile (mobile, password, surname, gender, esLicense, cLicense, companyName) {
	firebase.initializeApp({
		apiKey: "AIzaSyDQLbJKHvnnu8aouQbkPIKLUPqiSf-eqV4",
		authDomain: "msnwk-myspltd.firebaseapp.com",
		projectId: "msnwk-myspltd",
		storageBucket: "msnwk-myspltd.appspot.com",
		messagingSenderId: "60899409627",
		appId: "1:60899409627:web:5d46cc2d90c9e785cfd6fe",
		measurementId: "G-W889TDBLC6"
	})
	applicationVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", { size: "invisible" })
	provider = new firebase.auth.PhoneAuthProvider()
	verificationId = ""
	try {
		verificationId = await provider.verifyPhoneNumber(mobile, applicationVerifier)
	} catch (e) {
		alert("輸入無效")
	}
	if (verificationId) {
		while (true) {
			verificationCode = window.prompt("請輸入驗證碼")
			if (verificationCode) {
				phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode)
				try {
					await firebase.auth().signInWithCredential(phoneCredential)
					break
				} catch (e) {
					alert("驗證碼無效")
				}
			}
		}
		idToken = await firebase.auth().currentUser.getIdToken()
		await post({
			name: "verify",
			token: idToken,
			password: password,
			surname: surname,
			gender: gender,
			esLicense: esLicense,
			cLicense: cLicense,
			companyName: companyName
		})
		location.reload()
	}
}