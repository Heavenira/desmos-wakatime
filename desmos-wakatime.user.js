// ==UserScript==
// @name         WakaTime Support
// @namespace    ezropp.Desmos
// @version      1.2
// @description  WakaTime Support for the Desmos Graphing Calculator
// @author       Heavenira (Ezra Oppenheimer)
// @website      https://wakatime.com/
// @match        https://*.desmos.com/calculator*
// @grant        none
// @downloadURL	 https://github.com/Heavenira/desmos-wakatime/raw/main/desmos-wakatime.user.js
// ==/UserScript==

(function() {
    // WakaTime secret key goes here
    const secretKey = ""


    // POST to WakaTime via REST request
    function wakaTime(key) {
        fetch("https://proxy.jackz.me/wakatime.com/api/v1/users/current/heartbeats", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(key),
                "Content-Type": "applications/json"
            },
            body: JSON.stringify({
                "entity": "Desmos Graphing Calculator",
                "type": "app",
                "category": "coding",
                "time": Date.now() * 0.001,
                "project": "Desmos Projects",
                "branch": null,
                "language": "Desmos",
                "dependencies": [],
                "lines": lineCount,
                "lineno": null,
                "cursorpos": null,
                "is_write": null
            })
        })
    }


    let timestampCheckpoint = Date.now();
    function handleEvent() {
        let timestampNow = Date.now()
        if (timestampNow - timestampCheckpoint > 1000 * 115) { // heartbeat every 115 seconds
            console.log("POSTED")
            // refreshes the cooldown
            timestampCheckpoint = timestampNow;

            // gets the current graph name
            let graphName = document.querySelector(".dcg-variable-title").innerText;
            // gets the current graph URL
            let graphURL = window.location.href;
            // gets the line count
            let lineCount = Calc.getExpressions().length;

            // POST to WakaTime via REST request
            wakaTime(secretKey)
        }
    }


    // Add event listener on keypress
    document.addEventListener('keydown', handleEvent, false);
    
    console.log("desmos-wakatime loaded properly ✔️\n _   _ _____ ___  _   _ _____ _   _ ___________  ___  \n| | | |  ___/ _ \\| | | |  ___| \\ | |_   _| ___ \\/ _ \\ \n| |_| | |__/ /_\\ | | | | |__ |  \\| | | | | |_/ / /_\\ \\\n|  _  |  __|  _  | | | |  __|| . ` | | | |    /|  _  |\n| | | | |__| | | \\ \\_/ | |___| |\\  |_| |_| |\\ \\| | | |\n\\_| |_\\____\\_| |_/\\___/\\____/\\_| \\_/\\___/\\_| \\_\\_| |_/");
})();
