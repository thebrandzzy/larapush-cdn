function getLarapushAdConfig() {
	const timer_to_be = 5;
	const advert_to_be = '<a href="https://larapush.com/?utm_source=wordpress&utm_medium=plugin&utm_campaign=cleanup" target="_blank"><img src="https://raw.githubusercontent.com/larapush/larapush/main/ads/timeToCleanupYourPanel.gif" style="max-width: 100%; margin-top: 20px"></a>';
	const targetClicksCount = 2;
	const adInterval = 200;
	const ad_id = 48248;

	// if last click was more than intervel ago reset clicks count
	if (localStorage.getItem("larapush_ad_" + ad_id + "_last_time") == null || new Date().getTime() - localStorage.getItem("larapush_ad_" + ad_id + "_last_time") > adInterval * 1000) {
		localStorage.setItem("larapush_ad_" + ad_id + "_clicks", 0);
	}

	const currentClicksCount = localStorage.getItem("larapush_ad_" + ad_id + "_clicks") || 0;
	if (localStorage.getItem("larapush_ad_" + ad_id + "_last_time") == null || currentClicksCount < targetClicksCount) {
		var timer = timer_to_be;
		var advert = advert_to_be;
	}

	onCloseLaraPushAd = () => {
		localStorage.setItem("larapush_ad_" + ad_id + "_clicks", parseInt(currentClicksCount) + 1);
		localStorage.setItem("larapush_ad_" + ad_id + "_last_time", new Date().getTime());
	};

	return {
		timer,
		advert,
		onCloseLaraPushAd,
	};
	// return {
	// 	timer: undefined,
	// 	advert: undefined,
	// 	onCloseLaraPushAd: undefined,
	// };
}

function showAdInThePage() {
	const wrap = document.querySelector(".wrap");
	if (wrap) {
		let img = document.createElement("img");
		img.src = "https://raw.githubusercontent.com/larapush/larapush/main/ads/timeToCleanupYourPanel.gif";
		img.style.width = "100%";
		img.style.maxWidth = "800px";

		let a = document.createElement("a");
		a.href = "https://larapush.com/?utm_source=wordpress&utm_medium=plugin&utm_campaign=cleanup";
		a.target = "_blank";
		a.append(img);

		let div = document.createElement("div");
		div.style.display = "flex";
		div.style.justifyContent = "center";
		div.append(a);

		wrap.parentElement.insertBefore(div, wrap);
	}
}

// showAdInThePage();
// Test

