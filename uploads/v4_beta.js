let wallpaperElement;
const campaigns = [{
    campaignID: "001",
    campaignName: "Backup Campaign",
    campaignSlug: "backup_campaign",
    enabled: !0,
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
    enabled: !0,
    dateRanges: [{
        startDate: "24/12/2023 00:00 +05:30",
        endDate: "01/03/2024 18:00 +05:30"
    }, ]
}, {
    campaignID: "003",
    campaignName: "Update Campaign",
    campaignSlug: "update_campaign",
    enabled: 1,
    dateRanges: [{
        startDate: "18/09/2024 00:00 +05:30",
        endDate: "18/12/2024 00:00 +05:30"
    }]
}];
if (wallpaperElement = document.querySelector(".auth.login-bg")) {
    let e = ["https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1475257026007-0753d5429e10?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1613333151276-8a5b9a9d3d00?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
        a = e[Math.floor(Math.random() * e.length)];
    wallpaperElement.style.background = `url(${a})`,
        wallpaperElement.style.backgroundSize = "cover"
}

if (window.location.pathname == "/") {
    // Step 1: Find the image element with the class .login-logo
    const loginLogo = document.querySelector('.login-logo');

    // Step 1.5: Replace the src attribute
    if (loginLogo) {
        loginLogo.src = 'https://cdn.larapush.com/uploads/4_years_logo_animation.gif';
        
        // Step 2: Set the max-width to 100%
        loginLogo.style.maxWidth = '100%';

        // Step 4: Set the parent of the parent background color to #fcfcff
        if (loginLogo.parentElement?.parentElement) {
            loginLogo.parentElement.parentElement.style.backgroundColor = '#fcfcff';
        }
    }

    // Step 5: Remove <h4> containing "LOGIN NOW"
    const h4Elements = document.querySelectorAll('h4');
    h4Elements.forEach(h4 => {
        if (h4.textContent.trim() === 'LOGIN NOW') {
            h4.remove();
        }
    });
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
