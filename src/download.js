const fs = require("fs")
const mysql = require("mysql2/promise")
const { exec } = require("child_process")

main()

async function main () {

	const pool = await mysql.createPool({
		host: "localhost",
		user: "root",
		password: "3199!Important",
		database: "database",
		connectionLimit: 1000000000
	})

	lastUpdate = fs.readFileSync("./last_update.txt")

	res = await fetch("https://www.pland.gov.hk/pland_en/info_serv/digital_planning_data/Metadata/OZP_PLAN_GEOJSON.json")
    arr = await res.json()
	allPlans = {}
	newPlans = {}
	newLastUpdate = lastUpdate
    for (obj of arr) {
    	plan = obj.OZP_PLAN_NO
    	last = obj.GAZ_DATE
    	allPlans[plan.replaceAll("/", "_")] = last
    	if (last > lastUpdate && plan.split("/")[0] == "S") {
    		newPlans[plan.replaceAll("/", "_")] = last
    		if (last > newLastUpdate) {
    			newLastUpdate = last
    		}
    		exec('start chrome.exe "' + obj.GEOJSON_LINK + '"')
    	}
    }
    fs.writeFileSync("./all_plans.json", JSON.stringify(allPlans))
    fs.writeFileSync("./new_plans.json", JSON.stringify(newPlans))
    fs.writeFileSync("./last_update.txt", newLastUpdate)

	pool.end()

}