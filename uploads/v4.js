let wallpaperElement;const campaigns=[{campaignID:"001",campaignName:"Backup Campaign",campaignSlug:"backup_campaign",enabled:!0,dateRanges:[{startDate:"23/11/2023 20:00 +05:30",endDate:"24/12/2023 00:00 +05:30"},{startDate:"01/12/2024 18:00 +05:30",endDate:"01/12/2024 00:00 +05:30"}]},{campaignID:"002",campaignName:"Feedback Campaign",campaignSlug:"feedback_campaign",enabled:!0,dateRanges:[{startDate:"24/12/2023 00:00 +05:30",endDate:"01/03/2024 18:00 +05:30"}]},{campaignID:"003",campaignName:"Update Campaign",campaignSlug:"update_campaign",enabled:1,dateRanges:[{startDate:"18/09/2024 00:00 +05:30",endDate:"18/12/2024 00:00 +05:30"}]},{campaignID:"004",campaignName:"Scam Alert",campaignSlug:"scam_alert",enabled:1,dateRanges:[{startDate:"07/04/2025 00:00 +05:30",endDate:"27/10/2025 18:00 +05:30"}]}];if(wallpaperElement=document.querySelector(".auth.login-bg")){let e=["https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1475257026007-0753d5429e10?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1613333151276-8a5b9a9d3d00?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],t=e[Math.floor(Math.random()*e.length)];wallpaperElement.style.background=`url(${t})`,wallpaperElement.style.backgroundSize="cover"}if("/"==window.location.pathname&&new Date>=new Date("2025-01-26")&&new Date<=new Date("2025-02-10")){let e=document.querySelector(".login-logo");e&&(e.src="https://cdn.larapush.com/uploads/4_years_logo_animation.gif",e.style.maxWidth="100%",e.parentElement?.parentElement&&(e.parentElement.parentElement.style.backgroundColor="#fcfcff")),document.querySelectorAll("h4").forEach((e=>{"LOGIN NOW"===e.textContent.trim()&&e.remove()}))}function sleep(e){return new Promise((t=>setTimeout(t,e)))}function isDashboard(){return"/dashboard"==window.location.pathname}async function backup_campaign(e){if("/dashboard"==window.location.pathname&&"Pro Panel"==document.querySelector(".profile-name>span").innerText){var t=localStorage.getItem("backup_alert_"+e.campaignID);(null==t||moment().diff(moment(parseInt(t)),"days")>=7)&&Swal.fire({title:"Backup Your Data!",text:"Don't forget to regularly save your subscriber data. Click 'Export Now' to do this. This reminder will appear weekly.",imageUrl:"https://cdn.larapush.com/uploads/backup_alert.webp",imageWidth:400,imageAlt:"Backup Your Data",showCancelButton:!0,confirmButtonText:"Export Now",cancelButtonText:"Remind Me Later"}).then((t=>{console.log(t),t.value&&(localStorage.setItem("backup_alert_"+e.campaignID,moment().valueOf()),window.location.href="/integration/importNexport")}))}if("/integration/importNexport"==window.location.pathname&&"Pro Panel"==document.querySelector(".profile-name>span").innerText){var a=localStorage.getItem("import_export_cache_"+e.campaignID);await sleep(1e3),(null==a||moment().diff(moment(parseInt(a)),"days")>=7)&&introJs().setOptions({steps:[{element:document.querySelector(".btn-danger"),intro:"Click on this button to prepare your export."},{element:document.querySelector("#notificationDropdown").parentElement,intro:"⏬ Once your export is ready<br><br><b>Download Your Export from Here</b>"}],doneLabel:"OK"}).start().onchange((function(e){})).oncomplete((function(){localStorage.setItem("import_export_cache_"+e.campaignID,moment().valueOf())}))}}async function feedback_campaign(e){!isDashboard()||localStorage.getItem("feedback_done_"+e.campaignID)||Swal.fire({title:"We need your feedback!",text:"Working hard on our latest update, we value your feedback! Spare a moment to fill out this form and be the first to get early notification of the latest update.",imageUrl:"https://cdn.larapush.com/uploads/feedback_alert.webp",imageWidth:400,imageAlt:"We need your feedback!",showCancelButton:!1,confirmButtonText:"Fill Form Now!",cancelButtonText:"Remind Me Later",customClass:{confirmButton:"btn-block"}}).then((t=>{console.log(t),t.value&&(localStorage.setItem("feedback_done_"+e.campaignID,!0),window.open("https://bit.ly/3NFRMf1","_blank"))}))}function update_campaign(e){window.location.href.indexOf("/dashboard")>-1&&(document.querySelector("footer.footer.w-100.notranslate > div > div > div:nth-child(1)").innerText.indexOf("pro-prod-4.")>-1||document.querySelector("footer.footer.w-100.notranslate > div > div > div:nth-child(1)").innerText.indexOf("pro-beta-4.")>-1)&&0>function(e,t){e=e.split("."),t=t.split(".");for(var a=0;a<e.length;a++){if(e[a]>t[a])return 1;if(e[a]<t[a])return-1}return 0}(document.querySelector("footer.footer.w-100.notranslate > div > div > div:nth-child(1)").innerText.split("-")[2],"4.1.49")&&setTimeout((()=>{Swal.fire({title:"Major Updates and Patches Available!",text:"We have released a new update with major features and bug fixes. Click the button below to update your system.",imageUrl:"https://cdn.larapush.com/uploads/feedback_alert.webp",imageWidth:400,imageAlt:"Update Available",showCancelButton:0,confirmButtonText:"Update Now",customClass:{confirmButton:"btn-block"},allowOutsideClick:!1,allowEscapeKey:!1}).then((e=>{fetch("/update-server",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').getAttribute("content")},body:JSON.stringify({})}),Swal.fire({title:"System is Updating!",text:"Server Upgrade Added to Queue, Please wait for a few minutes. Your server will be rebooted automatically.",icon:"success",timer:1e4,timerProgressBar:!0,showConfirmButton:!1,allowOutsideClick:!1,allowEscapeKey:!1}).then((function(){location.reload()}))}))}),1e3)}async function scam_alert(e){if(!isDashboard())return;let t=localStorage.getItem("scam_alert_last_shown_"+e.campaignID);if(t){if(new Date(parseInt(t))>new Date((new Date).getTime()-864e5))return}!((localStorage.getItem("scam_alert_times_shown_"+e.campaignID)||0)>7)&&setTimeout((()=>{Swal.fire({imageUrl:"https://cdn.larapush.com/uploads/scam-alert.png",showConfirmButton:!1,showCloseButton:!0,allowOutsideClick:!1,allowEscapeKey:!1,customClass:{popup:"p-0"}}).then((()=>{localStorage.setItem("scam_alert_last_shown_"+e.campaignID,(new Date).getTime()),localStorage.setItem("scam_alert_times_shown_"+e.campaignID,parseInt(localStorage.getItem("scam_alert_times_shown_"+e.campaignID)||0)+1)}))}),200)}$(document).ready((async function(){let e=moment();for(let t of campaigns)if(t.enabled)for(let a of t.dateRanges){let o=moment(a.startDate,"DD/MM/YYYY HH:mm Z"),n=moment(a.endDate,"DD/MM/YYYY HH:mm Z");if(e.isBetween(o,n)&&"function"==typeof window[t.campaignSlug]){window[t.campaignSlug](t);break}}}));

/* Security update campaign, added 27 Aug 2026, pinned 4 Sep 2026.
   Prompts any panel below the build that closed the Aug 2026 compromise and fires
   the same /update-server the Settings > Update button uses. Later releases stay
   optional: bump LP_SECURITY_MIN_VERSION only when a build must reach every panel. */
const LP_SECURITY_MIN_VERSION = { 4: "4.3.0", 5: "5.3.0" };
const LP_UPDATE_WAIT_MS = 30 * 60 * 1000; // after one /update-server call, wait this long before firing another
campaigns.push({
  campaignID: "005",
  campaignName: "Security Update Campaign",
  campaignSlug: "security_update_campaign",
  enabled: 1,
  dateRanges: [{ startDate: "27/08/2026 00:00 +05:30", endDate: "31/12/2027 23:59 +05:30" }]
});

function lpCompareVersions(a, b) {
  const pa = String(a).split("."), pb = String(b).split(".");
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = parseInt(pa[i] || "0", 10), y = parseInt(pb[i] || "0", 10);
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

function lpReadPanelVersion() {
  const el = document.querySelector("footer.footer.notranslate .copyright");
  const m = el && el.innerText.match(/(premium|pro|startup)-(prod|beta|dev)-(\d+(?:\.\d+)+)/i);
  return m ? { plan: m[1].toLowerCase(), stage: m[2].toLowerCase(), version: m[3] } : null;
}

async function security_update_campaign(campaign) {
  if (!isDashboard()) return;

  const panel = lpReadPanelVersion();
  if (!panel || panel.stage === "dev") return; // dev builds appear in no feed

  const major = parseInt(panel.version, 10);
  if (!major) return;

  const latest = LP_SECURITY_MIN_VERSION[major];
  if (!latest || lpCompareVersions(latest, panel.version) <= 0) return;

  const startedKey = "security_update_started_" + campaign.campaignID;
  const startedAt = parseInt(localStorage.getItem(startedKey) || "0", 10);
  if (Date.now() - startedAt < LP_UPDATE_WAIT_MS) {
    // an update is already running; the reload after the timer re-checks the footer version
    Swal.fire({
      title: "Updating your server...",
      text: "The update to " + latest + " is in progress. Please wait, this page will check again in 30 seconds.",
      timer: 30000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: function () { Swal.showLoading(); }
    }).then(function () { location.reload(); });
    return;
  }

  const choice = await Swal.fire({
    title: "Security Update Required",
    html:
      "This panel is running <b>" + panel.plan + "-" + panel.stage + "-" + panel.version + "</b>.<br>" +
      "Version <b>" + latest + "</b> fixes security issues that affect every panel.<br><br>" +
      "Updating takes a few minutes and restarts your server.",
    icon: "warning",
    confirmButtonText: "Update Now",
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: { confirmButton: "btn-block" }
  });
  if (!choice.value) return;

  Swal.fire({
    title: "Starting the update...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: function () { Swal.showLoading(); }
  });

  let ok = false, message = "";
  localStorage.setItem(startedKey, String(Date.now()));
  try {
    const res = await fetch("/update-server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
      },
      body: JSON.stringify({})
    });
    const data = await res.json().catch(function () { return {}; });
    ok = res.ok && data.success === true;
    message = data.message || (res.status + " " + res.statusText);
  } catch (err) {
    message = err.message;
  }

  if (ok) {
    Swal.fire({
      title: "Update queued",
      text: "Your server is updating and will restart on its own. This page will reload shortly.",
      icon: "success",
      timer: 15000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(function () { location.reload(); });
  } else {
    localStorage.removeItem(startedKey); // nothing started, so the next visit may try again
    // dismissible on failure, so a panel is never stuck behind a modal it cannot close
    Swal.fire({
      title: "Update could not start",
      html: message + "<br><br>Please contact LaraPush support.",
      icon: "error",
      confirmButtonText: "Close"
    });
  }
}

/* Service account keys campaign, added 12 Sep 2026.
   After the Aug 2026 compromise every panel must regenerate its Firebase service account
   keys. Nags on the dashboard, 5 minutes after each close, until the user ticks the box. */
const LP_SA_VIDEOS = { en: "MO11aF5indI", hi: "-T_aT06LV98" };
const LP_SA_SNOOZE_MS = 5 * 60 * 1000;
campaigns.push({
  campaignID: "006",
  campaignName: "Service Account Keys Campaign",
  campaignSlug: "service_account_keys_campaign",
  enabled: 1,
  dateRanges: [{ startDate: "12/09/2026 00:00 +05:30", endDate: "31/12/2027 23:59 +05:30" }]
});

function service_account_keys_campaign(campaign) {
  if (!isDashboard()) return;
  const doneKey = "service_account_keys_done_" + campaign.campaignID;
  const closedKey = "service_account_keys_closed_" + campaign.campaignID;
  const langKey = "service_account_keys_lang_" + campaign.campaignID;
  if (localStorage.getItem(doneKey)) return;

  if (!document.getElementById("lp-sa-style")) {
    const style = document.createElement("style");
    style.id = "lp-sa-style";
    style.textContent =
      ".lp-sa-icon{display:inline-flex;width:30px;height:30px;border-radius:50%;background:#f59e0b;color:#fff;font-size:20px;font-weight:700;align-items:center;justify-content:center;vertical-align:middle;margin:0 10px 4px 0}" +
      ".lp-sa-text{margin:0 0 14px;color:#4b5563;font-size:14px;line-height:1.55;text-align:left}" +
      ".lp-sa-lang{display:inline-flex;border:1px solid #d9dce3;border-radius:999px;padding:3px;margin-bottom:14px}" +
      ".lp-sa-lang button{border:0;background:none;padding:6px 18px;border-radius:999px;font-size:13px;font-weight:600;color:#555;cursor:pointer;line-height:1.4}" +
      ".lp-sa-lang button.active{background:#1f2937;color:#fff}" +
      ".lp-sa-video{position:relative;padding-top:56.25%;border-radius:10px;overflow:hidden;background:#000}" +
      ".lp-sa-video iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}" +
      ".lp-sa-open{display:inline-block;margin-top:12px;padding:7px 16px;border:1px solid #d9dce3;border-radius:8px;font-size:13px;font-weight:600;color:#374151;text-decoration:none}" +
      ".lp-sa-open:hover{background:#f3f4f6;color:#111827;text-decoration:none}" +
      ".lp-sa-popup .swal2-checkbox{margin:18px auto 6px;font-size:14px;color:#374151}";
    document.head.appendChild(style);
  }

  const embed = function (lang) {
    return "https://www.youtube.com/embed/" + LP_SA_VIDEOS[lang] + "?rel=0";
  };
  const watch = function (lang) {
    return "https://www.youtube.com/watch?v=" + LP_SA_VIDEOS[lang];
  };

  const show = function () {
    if (localStorage.getItem(doneKey)) return;
    if (Swal.isVisible()) { setTimeout(show, 60 * 1000); return; } // another popup is up (e.g. the update), retry later

    const lang = LP_SA_VIDEOS[localStorage.getItem(langKey)] ? localStorage.getItem(langKey) : "en";
    Swal.fire({
      title: '<span class="lp-sa-icon">!</span>Regenerate your service account keys',
      html:
        '<p class="lp-sa-text">Recently there was a security incident that affected multiple panels. As a security precaution, we are requesting everyone to regenerate their service account keys.</p>' +
        '<div class="lp-sa-lang">' +
        '<button type="button" data-lang="en"' + (lang === "en" ? ' class="active"' : "") + ">English</button>" +
        '<button type="button" data-lang="hi"' + (lang === "hi" ? ' class="active"' : "") + ">हिंदी</button>" +
        "</div>" +
        '<div class="lp-sa-video"><iframe src="' + embed(lang) + '" title="How to regenerate service account keys" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>' +
        '<a class="lp-sa-open" href="' + watch(lang) + '" target="_blank" rel="noopener">Open in New Tab &#8599;</a>',
      input: "checkbox",
      inputPlaceholder: "I have changed my service account keys",
      confirmButtonText: "Close",
      showCancelButton: false,
      width: 640,
      customClass: { popup: "lp-sa-popup", confirmButton: "btn-block" }
    }).then(function (r) {
      if (r.value === 1) {
        localStorage.setItem(doneKey, String(Date.now()));
        return;
      }
      localStorage.setItem(closedKey, String(Date.now()));
      setTimeout(show, LP_SA_SNOOZE_MS);
    });

    document.querySelectorAll(".lp-sa-lang button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const next = btn.getAttribute("data-lang");
        localStorage.setItem(langKey, next);
        document.querySelectorAll(".lp-sa-lang button").forEach(function (b) { b.classList.toggle("active", b === btn); });
        document.querySelector(".lp-sa-video iframe").src = embed(next);
        document.querySelector(".lp-sa-open").href = watch(next);
      });
    });
  };

  const closedAt = parseInt(localStorage.getItem(closedKey) || "0", 10);
  setTimeout(show, Math.max(0, closedAt + LP_SA_SNOOZE_MS - Date.now()));
}

/* Register page, added 12 Sep 2026: the license error text hardcodes larapush.com/contact in
   every shipped panel, so the swap to a support.larapush.com link lives here, not in a release. */
if (window.location.pathname === "/register") {
  document.querySelectorAll(".alert-danger").forEach(function (el) {
    if (el.textContent.indexOf("larapush.com/contact") === -1) return;
    el.innerHTML = el.innerHTML.replace(
      /https:\/\/larapush\.com\/contact\.?/g,
      '<a href="https://support.larapush.com" target="_blank" rel="noopener" class="alert-link" style="text-decoration:underline">support.larapush.com</a>'
    );
  });
}
