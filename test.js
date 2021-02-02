const puppeteer = require('puppeteer');

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

async function retrieveNearByCars(currentLat, currentLng, maxDistanceKmeter) {
  console.log("AutoTell - Checking for cars:");
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('https://autotel.co.il/assets/map/maptest.php');

  list = await page.evaluate(() => cars);
  console.log("Current location: " + currentLat + "," + currentLng)
  console.log("Filtering cars with max " + maxDistanceKmeter + "KM distance.")

  const nearByAddresses = list.filter(v =>
    distance(currentLat, currentLng, v.info.latitude, v.info.longitude, "K") <= maxDistanceKmeter &&
      v.info.carsList.length > 0
  ).map(v => v.info.parkingAddress.filter(info => info.languageId == 0)[0].text.split("").reverse().join(""))

  console.log("Found " + nearByAddresses.length + " near by cars! They are in:");
  console.log(JSON.stringify(nearByAddresses));

  await browser.close();
  return nearByAddresses;
}

res = retrieveNearByCars(32.070911, 34.780494, 0.3)
