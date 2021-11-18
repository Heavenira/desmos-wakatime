// ==UserScript==
// @name         WakaTime Support
// @namespace    ezropp.Desmos
// @version      1.0
// @description  WakaTime Support for the Desmos Graphing Calculator
// @author       Heavenira (Ezra Oppenheimer)
// @website      https://wakatime.com/
// @match        https://*.desmos.com/calculator*
// @grant        none
// ==/UserScript==

(function() {
    // WakaTime secret key goes here
    const secretKey = ""


    // POST to WakaTime via REST request
    function wakaTime(key, graphName, graphURL, lineCount, lineSelected) {
        fetch("https://proxy.jackz.me/wakatime.com/api/v1/users/current/heartbeats", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(key),
                "Content-Type": "applications/json"
            },
            body: JSON.stringify({
                "entity": graphName,
                "type": "app",
                "category": "coding",
                "time": Date.now() * 0.001,
                "project": "Desmos Projects",
                "branch": graphURL,
                "language": "Desmos",
                "dependencies": [],
                "lines": lineCount,
                "lineno": lineSelected,
                "cursorpos": null,
                "is_write": null
            })
        })
    }


    function handleEvent() {
        let timestampNow = Date.now()
        if (timestampNow - timestampCheckpoint > 1000 * 115) { // heartbeat every 115 seconds
            console.log("POSTED")
            // refreshes the cooldown
            let timestampCheckpoint = timestampNow;

            // gets the current graph name
            let graphName = document.querySelector(".dcg-variable-title").innerText;
            // gets the current graph URL
            let graphURL = window.location.href;
            // gets the current line selected
            if (Calc.selectedExpressionId === undefined) {
                let lineSelected = null;
            } else {
                let lineSelected = Calc.getExpressions().findIndex(item => item.id == Calc.selectedExpressionId) + 1;
            }
            // gets the line count
            let lineCount = Calc.getExpressions().length;

            // POST to WakaTime via REST request
            wakaTime(secretKey, graphName, graphURL, lineCount, lineSelected)
        }
    }


    // Add event listener on keypress
    let timestampCheckpoint = Date.now();
    document.addEventListener('keydown', handleEvent, false);
    document.addEventListener('mouse', handleEvent, false);
})();