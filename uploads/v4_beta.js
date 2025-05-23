let wallpaperElement;
const campaigns = [{
    campaignID: "001",
    campaignName: "Backup Campaign",
    campaignSlug: "backup_campaign",
    enabled: 0,
    dateRanges: [{
        startDate: "23/11/2023 20:00 +05:30",
        endDate: "24/12/2023 00:00 +05:30"
    }, {
        startDate: "01/12/2024 18:00 +05:30",
        endDate: "01/12/2024 00:00 +05:30"
    }, ]
}, {
    campaignID: "002",
    campaignName: "Feedback Campaign",
    campaignSlug: "feedback_campaign",
    enabled: 0,
    dateRanges: [{
        startDate: "24/12/2023 00:00 +05:30",
        endDate: "01/03/2024 18:00 +05:30"
    }, ]
}, {
    campaignID: "003",
    campaignName: "Update Campaign",
    campaignSlug: "update_campaign",
    enabled: 0,
    dateRanges: [{
        startDate: "18/09/2024 00:00 +05:30",
        endDate: "18/12/2024 00:00 +05:30"
    }]
},{
    campaignID: "004",
    campaignName: "Scam Alert",
    campaignSlug: "scam_alert",
    enabled: 0,
    dateRanges: [{
        startDate: "07/04/2025 00:00 +05:30",
        endDate: "07/04/2026 18:00 +05:30"
    }]
},
{
    campaignID: "005",
    campaignName: "Feedback Campaign 2",
    campaignSlug: "feedback_campaign_2",
    enabled: 1,
    dateRanges: [{
        startDate: "19/05/2025 00:00 +05:30",
        endDate: "19/07/2025 00:00 +05:30"
    }]
}];
if (wallpaperElement = document.querySelector(".auth.login-bg")) {
    let e = ["https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1475257026007-0753d5429e10?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1613333151276-8a5b9a9d3d00?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
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

async function feedback_campaign(e) {
    !(!isDashboard() || localStorage.getItem("feedback_done_" + e.campaignID)) && Swal.fire({
        title: "We need your feedback!",
        text: "Working hard on our latest update, we value your feedback! Spare a moment to fill out this form and be the first to get early notification of the latest update.",
        imageUrl: "https://cdn.larapush.com/uploads/feedback_alert.webp",
        imageWidth: 400,
        imageAlt: "We need your feedback!",
        showCancelButton: !1,
        confirmButtonText: "Fill Form Now!",
        cancelButtonText: "Remind Me Later",
        customClass: {
            confirmButton: "btn-block"
        }
    }).then(a => {
        console.log(a),
            a.value && (localStorage.setItem("feedback_done_" + e.campaignID, !0),
                window.open("https://bit.ly/3NFRMf1", "_blank"))
    })
}

async function scam_alert(e) {
    if(!isDashboard()) {
        return;
    }

    // Only show if last time shown was more than 1 day ago
    if(localStorage.getItem("scam_alert_last_shown_" + e.campaignID)) {
        if(new Date(localStorage.getItem("scam_alert_last_shown_" + e.campaignID)) > new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)) {
            return;
        }
    }

    // Only show if scam_alert_times_shown_<campaignID> is less than 7
    if((localStorage.getItem("scam_alert_times_shown_" + e.campaignID) || 0) > 7) {
        return;
    }

    Swal.fire({
        imageUrl: "https://cdn.larapush.com/uploads/scam-alert.png",
        showConfirmButton: false,
        showCloseButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
            popup: 'p-0'
        }
    }).then(() => {
        localStorage.setItem("scam_alert_last_shown_" + e.campaignID, new Date().getTime());
        localStorage.setItem("scam_alert_times_shown_" + e.campaignID, (parseInt(localStorage.getItem("scam_alert_times_shown_" + e.campaignID) || 0) + 1);
    });
}

function update_campaign(e) {
    function version_compare(a, b) {
        var a = a.split('.');
        var b = b.split('.');
        for (var i = 0; i < a.length; i++) {
            if (a[i] > b[i]) {
                return 1;
            }
            if (a[i] < b[i]) {
                return -1;
            }
        }
        return 0;
    }


    // check if the url has /dashboard in it
    if (window.location.href.indexOf("/dashboard") > -1) {
        // check if footer has pro-prod-4.* or pro-beta-4.* in it
        if (document.querySelector('footer.footer.w-100.notranslate > div > div > div:nth-child(1)').innerText.indexOf("pro-prod-4.") > -1 || document.querySelector('footer.footer.w-100.notranslate > div > div > div:nth-child(1)').innerText.indexOf("pro-beta-4.") > -1) {
            // get the version number and compare it to 4.1.49, if less than 4.1.49, show the update button
            var version = document.querySelector('footer.footer.w-100.notranslate > div > div > div:nth-child(1)').innerText.split('-')[2];
            if (version_compare(version, "4.1.49") < 0) {
                // show the update button
                setTimeout(() => {
                    Swal.fire({
                        title: "Major Updates and Patches Available!",
                        text: "We have released a new update with major features and bug fixes. Click the button below to update your system.",
                        imageUrl: "https://cdn.larapush.com/uploads/feedback_alert.webp",
                        imageWidth: 400,
                        imageAlt: "Update Available",
                        showCancelButton: 0,
                        confirmButtonText: "Update Now",
                        customClass: {
                            confirmButton: "btn-block"
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(a => {
                        let csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                        fetch('/update-server', {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrf
                            },
                            body: JSON.stringify({})
                        })

                        Swal.fire({
                            title: 'System is Updating!',
                            text: 'Server Upgrade Added to Queue, Please wait for a few minutes. Your server will be rebooted automatically.',
                            icon: 'success',
                            timer: 10000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then(function() {
                            location.reload();
                        });
                    })
                }, 1000);
            }
        }
    }

}

function feedback_campaign_2(e) {
    if(!isDashboard()) {
        return;
    }

    const subscribersData = document.getElementById('subscribers-data');
    if (subscribersData) {
        const img = document.createElement('img');
        img.src = 'https://cdn.larapush.com/uploads/v4_upgrade_banner.gif';
        img.alt = 'Latest Upgrade';
        img.style.cursor = 'pointer';
        img.style.maxWidth = '100%';
        img.style.marginBottom = '20px';
        img.style.width = '1000px';
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
        img.onclick = () => window.open('https://larapush.com/upgrade-checkout?product=version-upgrade&coupon=BA7JIYTW&panel=' + window.location.host, '_blank');
        
        subscribersData.parentNode.insertBefore(img, subscribersData);
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
