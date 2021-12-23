// ==UserScript==
// @name         WakaTime Support
// @namespace    ezropp.Desmos
// @version      1.5
// @description  WakaTime Support for the Desmos Graphing Calculator
// @author       Heavenira (Ezra Oppenheimer)
// @website      https://wakatime.com/
// @match        https://*.desmos.com/calculator*
// @grant        GM.xmlHttpRequest
// @downloadURL	 https://github.com/Heavenira/desmos-wakatime/raw/main/desmos-wakatime.user.js
// ==/UserScript==


(function() {

    // WakaTime secret key goes here
    const secretKey = "";

    // Notifies the user that their key is blank
    if (!secretKey) {
        console.warn("WakaTime secret key is currently blank.");
    }

    // POST to WakaTime via REST request
    function wakaTime(key, graphName, graphURL, lineCount) {
        GM.xmlHttpRequest({
            method: "POST",
            url: "https://wakatime.com/api/v1/users/current/heartbeats",
            headers: {
                "Authorization": "Basic " + btoa(key), // Base64 conversion of `secretKey`
                "Content-Type": "applications/json"
            },
            data: JSON.stringify({
                // This is background information for WakaTime to handle. These values need no change.
                "language": "Desmos", // constant
                "category": "coding", // constant
                "type": "app", // constant
                "dependencies": [], // constant
                "time": Date.now() * 0.001, // constant
                "lines": lineCount, // constant
                "lineno": null, // (int) I tend not to touch this; seems redundant for visualizations
                "cursorpos": null, // redundant
                "is_write": null, // (boolean) Maybe this could be implemented in the future?
                
                // Everything below will show up in your Leaderboard.
                // This is personally the heartbeat scheme that I use.
                "project": "Desmos Projects",
                "entity": graphURL,
                "branch": graphName

                // But if you are unhappy with the above, you can opt with this instead.
                /*
                "project": graphName,
                "entity": graphURL,
                "branch": null
                */
            })
        });
    }

    let timestampCheckpoint = Date.now(); // declares a checkpoint upon initialization

    // Function that handles a key being pressed
    function handleEvent() {

        let timestampNow = Date.now();

        if (timestampNow - timestampCheckpoint > 1000 * 120) { // heartbeat every 120 seconds

            let graphName = document.querySelector(".dcg-variable-title").innerText; // gets the current graph name

            let graphURL = window.location.href; // gets the current graph URL

            let lineCount = Calc.getExpressions().length; // gets the line count

            // POST to WakaTime via REST request
            if (secretKey) {
                wakaTime(secretKey, graphName, graphURL, lineCount);
                console.log("POSTED");
            }

            timestampCheckpoint = timestampNow; // refreshes the cooldown
        }
    }

    // Add event listener on keypress
    document.addEventListener('keydown', handleEvent, false);

    console.log("desmos-wakatime loaded properly ✔️\n _   _ _____ ___  _   _ _____ _   _ ___________  ___  \n| | | |  ___/ _ \\| | | |  ___| \\ | |_   _| ___ \\/ _ \\ \n| |_| | |__/ /_\\ | | | | |__ |  \\| | | | | |_/ / /_\\ \\\n|  _  |  __|  _  | | | |  __|| . ` | | | |    /|  _  |\n| | | | |__| | | \\ \\_/ | |___| |\\  |_| |_| |\\ \\| | | |\n\\_| |_\\____\\_| |_/\\___/\\____/\\_| \\_/\\___/\\_| \\_\\_| |_/");

})();
