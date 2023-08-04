let wallpaperElement = document.querySelector('.auth.login-bg');
if(wallpaperElement) {
    wallpaperElement.style.background = 'url(https://source.unsplash.com/1920x1080/?wallpaper)';
    wallpaperElement.style.backgroundSize = 'cover';
}



$(document).ready(function () {
    if (
        window.location.pathname == "/dashboard" &&
        document.querySelector(".profile-name>span").innerText == "Pro Panel"
    ) {
        var backup_alert = localStorage.getItem("backup_alert");

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
                    localStorage.setItem("backup_alert", moment().valueOf());

                    // Redirect to /integration/importNexport
                    window.location.href = "/integration/importNexport";
                }
            });
        }
    }

    if (
        window.location.pathname == "/integration/importNexport" &&
        document.querySelector(".profile-name>span").innerText == "Pro Panel"
    ) {
        var import_export_cache = localStorage.getItem("import_export_cache");

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
                        "import_export_cache",
                        moment().valueOf()
                    );
                });
        }
    }
});
