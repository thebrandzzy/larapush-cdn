// Define the campaigns object
let wallpaperElement;
const campaigns = [
    {
        campaignID: '001',
        campaignName: 'Backup Campaign',
        campaignSlug: 'backup_campaign',
        enabled: true,
        dateRanges: [
            {
                startDate: '23/11/2023 20:00 +05:30',
                endDate: '24/12/2023 00:00 +05:30'
            },
            {
                startDate: '01/12/2024 18:00 +05:30',
                endDate: '01/12/2024 00:00 +05:30'
            },
        ]
    },
    {
        campaignID: '002',
        campaignName: 'Feedback Campaign',
        campaignSlug: 'feedback_campaign',
        enabled: true,
        dateRanges: [
            {
                startDate: '24/12/2023 00:00 +05:30',
                endDate: '01/12/2024 18:00 +05:30'
            },
        ]
    },
    // Add more campaigns as needed
]

// Your existing wallpaper code
wallpaperElement = document.querySelector('.auth.login-bg');
if (wallpaperElement) {
    wallpaperElement.style.background = 'url(https://source.unsplash.com/1920x1080/?wallpaper)';
    wallpaperElement.style.backgroundSize = 'cover';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(async function () {
    // Get the current date-time
    const now = moment();

    // Loop through the campaigns object
    for (const campaign of campaigns) {
        // Check if the campaign is enabled
        if (campaign.enabled) {
            // Loop through each date range in the campaign
            for (const range of campaign.dateRanges) {
                // Get the start and end date-time of the current range
                const start = moment(range.startDate, 'DD/MM/YYYY HH:mm Z');
                const end = moment(range.endDate, 'DD/MM/YYYY HH:mm Z');

                // Check if the current date-time is between the start and end date-time of the range
                if (now.isBetween(start, end)) {
                    // Run the campaign
                    if (typeof window[campaign.campaignSlug] === 'function') {
                        window[campaign.campaignSlug](campaign);
                        break; // Exit the loop if the campaign is run for one valid date range
                    }
                }
            }
        }
    }
});


// check if page is dashboard
function isDashboard() {
    return window.location.pathname == "/dashboard";
}

async function backup_campaign(campaign) {
    if (
        window.location.pathname == "/dashboard" &&
        document.querySelector(".profile-name>span").innerText == "Pro Panel"
    ) {
        var backup_alert = localStorage.getItem("backup_alert_" + campaign.campaignID);

        // Check if the 'backup_alert' exists and is not older than 7 days
        if (
            backup_alert == null ||
            moment().diff(moment(parseInt(backup_alert)), "days") >= 7
        ) {
            Swal.fire({
                title: "Backup Your Data!",
                text: "Don't forget to regularly save your subscriber data. Click 'Export Now' to do this. This reminder will appear weekly.",
                imageUrl:
                    "https://cdn.larapush.com/uploads/backup_alert.webp",
                imageWidth: 400,
                imageAlt: "Backup Your Data",
                showCancelButton: true,
                confirmButtonText: "Export Now",
                cancelButtonText: "Remind Me Later",
            }).then((result) => {
                console.log(result);
                if (result.value) {
                    // Set the current time as the value for 'backup_alert'
                    localStorage.setItem("backup_alert_" + campaign.campaignID, moment().valueOf());

                    // Redirect to /integration/importNexport₹§§§ˆ₹£
                    window.location.href = "/integration/importNexport";
                }
            });
        }
    }

    if (
        window.location.pathname == "/integration/importNexport" &&
        document.querySelector(".profile-name>span").innerText == "Pro Panel"
    ) {
        var import_export_cache = localStorage.getItem("import_export_cache_" + campaign.campaignID);

        // Wait 1 second to load the data
        await sleep(1000);

        // Check if the 'import_export_cache' exists and is not older than 7 days
        if (
            import_export_cache == null ||
            moment().diff(moment(parseInt(import_export_cache)), "days") >= 7
        ) {
            introJs()
                .setOptions({
                    steps: [
                        {
                            element: document.querySelector(".btn-danger"),
                            intro: "Click on this button to prepare your export.",
                        },
                        {
                            element: document.querySelector(
                                "#notificationDropdown"
                            ).parentElement,
                            intro: `⏬ Once your export is ready<br><br><b>Download Your Export from Here</b>`,
                        },
                    ],
                    doneLabel: "OK",
                })
                .start()
                .onchange(function (targetElement) {})
                .oncomplete(function () {
                    // Set the current time as the value for 'import_export_cache' when introJs tutorial is completed
                    localStorage.setItem(
                        "import_export_cache_" + campaign.campaignID,
                        moment().valueOf()
                    );
                });
        }
    }
}

async function feedback_campaign(campaign) {
    // return if page is not dashboard
    if (!isDashboard()) {
        return;
    }

    if (localStorage.getItem("feedback_done_" + campaign.campaignID)) {
        return;
    }
    
    Swal.fire({
        title: "We need your feedback!",
        text: "Working hard on our latest update, we value your feedback! Spare a moment to fill out this form and be the first to get early notification of the latest update.",
        imageUrl:
            "https://cdn.larapush.com/uploads/feedback_alert.webp",
        imageWidth: 400,
        imageAlt: "We need your feedback!",
        showCancelButton: false,
        confirmButtonText: "Fill Form Now!",
        cancelButtonText: "Remind Me Later",
        customClass: {
            confirmButton: "btn-block",
        },
    }).then((result) => {
        console.log(result);
        if (result.value) {
            // Set the feedback_done value as true
            localStorage.setItem("feedback_done_" + campaign.campaignID, true);

            window.open("https://bit.ly/3NFRMf1", "_blank");
        }
    });
}