function getLarapushAdConfig() {
	const timer_to_be = 5;
	const advert_to_be = '<a href="https://larapush.com/?utm_source=wordpress&utm_medium=plugin&utm_campaign=cleanup" target="_blank"><img src="https://raw.githubusercontent.com/larapush/larapush/main/ads/timeToCleanupYourPanel.gif" style="max-width: 100%; margin-top: 20px"></a>';
	const targetClicksCount = 2;
	const adInterval = 20;
	const ad_id = 48348;
	const currentClicksCount = localStorage.getItem("larapush_ad_" + ad_id + "_clicks") || 0;

	// if last click was more than intervel ago reset clicks count
	if (localStorage.getItem("larapush_ad_" + ad_id + "_last_time") == null || new Date().getTime() - localStorage.getItem("larapush_ad_" + ad_id + "_last_time") > adInterval * 1000) {
		localStorage.setItem("larapush_ad_" + ad_id + "_clicks", 0);
	}

	if (localStorage.getItem("larapush_ad_" + ad_id + "_last_time") == null || currentClicksCount < targetClicksCount) {
		var timer = timer_to_be;
		var advert = advert_to_be;
	}

	return {
		timer,
		advert,
	};
}

const closeLaraPushAd = () => {
	localStorage.setItem("larapush_ad_" + ad_id + "_clicks", parseInt(currentClicksCount) + 1);
	localStorage.setItem("larapush_ad_" + ad_id + "_last_time", new Date().getTime());
};
