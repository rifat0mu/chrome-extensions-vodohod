(function() {

    async function getDisplayPanel() {
        var panel = document.getElementById("panel");
        if(panel){
            await chrome.storage.local.get("panelDisplay", function(data) {
                if(typeof data.panelDisplay == "undefined") {
                    // That's kind of bad
                } else {
                    panel.style.display = data.panelDisplay;
                }
                var dsiplay;
                if(panel.style.display == 'none')
                    dsiplay = 'none';
                else
                    dsiplay = 'block';
                chrome.storage.local.set({panelDisplay: dsiplay});
            });
        }
    }

    setTimeout(getDisplayPanel, 1000);
})();

