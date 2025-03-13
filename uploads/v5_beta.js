let wallpaperElement;
const campaigns = [{
    campaignID: "001",
    campaignName: "Backup Campaign",
    campaignSlug: "backup_campaign",
    enabled: !1,
    dateRanges: [{
        startDate: "23/11/2023 20:00 +05:30",
        endDate: "24/12/2023 00:00 +05:30"
    }, {
        startDate: "01/12/2024 18:00 +05:30",
        endDate: "01/12/2024 00:00 +05:30"
    }]
}];

if (wallpaperElement = document.querySelector(".auth.login-bg")) {
    let e = [
        "https://images.unsplash.com/photo-1734613414358-66038a779fed?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1593344352545-ffb4a9512528?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
        a = e[Math.floor(Math.random() * e.length)];
    wallpaperElement.style.background = `url(${a})`,
        wallpaperElement.style.backgroundSize = "cover"
}

function sleep(e) {
    return new Promise(a => setTimeout(a, e))
}

function isDashboard() {
    return "/dashboard" == window.location.pathname
}
async function backup_campaign(e) {
    if ("/dashboard" == window.location.pathname && "Pro Panel" == document.querySelector(".profile-name>span").innerText) {
        var a = localStorage.getItem("backup_alert_" + e.campaignID);
        (null == a || moment().diff(moment(parseInt(a)), "days") >= 7) && Swal.fire({
            title: "Backup Your Data!",
            text: "Don't forget to regularly save your subscriber data. Click 'Export Now' to do this. This reminder will appear weekly.",
            imageUrl: "https://cdn.larapush.com/uploads/backup_alert.webp",
            imageWidth: 400,
            imageAlt: "Backup Your Data",
            showCancelButton: !0,
            confirmButtonText: "Export Now",
            cancelButtonText: "Remind Me Later"
        }).then(a => {
            console.log(a),
                a.value && (localStorage.setItem("backup_alert_" + e.campaignID, moment().valueOf()),
                    window.location.href = "/integration/importNexport")
        })
    }
    if ("/integration/importNexport" == window.location.pathname && "Pro Panel" == document.querySelector(".profile-name>span").innerText) {
        var t = localStorage.getItem("import_export_cache_" + e.campaignID);
        await sleep(1e3),
            (null == t || moment().diff(moment(parseInt(t)), "days") >= 7) && introJs().setOptions({
                steps: [{
                    element: document.querySelector(".btn-danger"),
                    intro: "Click on this button to prepare your export."
                }, {
                    element: document.querySelector("#notificationDropdown").parentElement,
                    intro: `⏬ Once your export is ready<br><br><b>Download Your Export from Here</b>`
                }, ],
                doneLabel: "OK"
            }).start().onchange(function(e) {}).oncomplete(function() {
                localStorage.setItem("import_export_cache_" + e.campaignID, moment().valueOf())
            })
    }
}

$(document).ready(async function() {
    let e = moment();
    for (let a of campaigns)
        if (a.enabled)
            for (let t of a.dateRanges) {
                let n = moment(t.startDate, "DD/MM/YYYY HH:mm Z"),
                    o = moment(t.endDate, "DD/MM/YYYY HH:mm Z");
                if (e.isBetween(n, o) && "function" == typeof window[a.campaignSlug]) {
                    window[a.campaignSlug](a);
                    break
                }
            }
});