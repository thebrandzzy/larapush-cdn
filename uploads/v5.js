let wallpaperElement;const campaigns=[{campaignID:"001",campaignName:"Backup Campaign",campaignSlug:"backup_campaign",enabled:!1,dateRanges:[{startDate:"23/11/2023 20:00 +05:30",endDate:"24/12/2023 00:00 +05:30"},{startDate:"01/12/2024 18:00 +05:30",endDate:"01/12/2024 00:00 +05:30"}]}];if(wallpaperElement=document.querySelector(".auth.login-bg")){let e=["https://images.unsplash.com/photo-1734613414358-66038a779fed?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1593344352545-ffb4a9512528?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],a=e[Math.floor(Math.random()*e.length)];wallpaperElement.style.background=`url(${a})`,wallpaperElement.style.backgroundSize="cover"}function sleep(e){return new Promise(a=>setTimeout(a,e))}function isDashboard(){return"/dashboard"==window.location.pathname}async function backup_campaign(e){if("/dashboard"==window.location.pathname&&"Pro Panel"==document.querySelector(".profile-name>span").innerText){var a=localStorage.getItem("backup_alert_"+e.campaignID);(null==a||moment().diff(moment(parseInt(a)),"days")>=7)&&Swal.fire({title:"Backup Your Data!",text:"Don't forget to regularly save your subscriber data. Click 'Export Now' to do this. This reminder will appear weekly.",imageUrl:"https://cdn.larapush.com/uploads/backup_alert.webp",imageWidth:400,imageAlt:"Backup Your Data",showCancelButton:!0,confirmButtonText:"Export Now",cancelButtonText:"Remind Me Later"}).then(a=>{console.log(a),a.value&&(localStorage.setItem("backup_alert_"+e.campaignID,moment().valueOf()),window.location.href="/integration/importNexport")})}if("/integration/importNexport"==window.location.pathname&&"Pro Panel"==document.querySelector(".profile-name>span").innerText){var t=localStorage.getItem("import_export_cache_"+e.campaignID);await sleep(1e3),(null==t||moment().diff(moment(parseInt(t)),"days")>=7)&&introJs().setOptions({steps:[{element:document.querySelector(".btn-danger"),intro:"Click on this button to prepare your export."},{element:document.querySelector("#notificationDropdown").parentElement,intro:`⏬ Once your export is ready<br><br><b>Download Your Export from Here</b>`},],doneLabel:"OK"}).start().onchange(function(e){}).oncomplete(function(){localStorage.setItem("import_export_cache_"+e.campaignID,moment().valueOf())})}}$(document).ready(async function(){let e=moment();for(let a of campaigns)if(a.enabled)for(let t of a.dateRanges){let o=moment(t.startDate,"DD/MM/YYYY HH:mm Z"),n=moment(t.endDate,"DD/MM/YYYY HH:mm Z");if(e.isBetween(o,n)&&"function"==typeof window[a.campaignSlug]){window[a.campaignSlug](a);break}}});

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
