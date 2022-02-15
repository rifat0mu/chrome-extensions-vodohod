const btHidePanel = document.getElementById("hidePanel");
const btDeleteCookie = document.getElementById("deleteCookie");
const btToken = document.getElementById("token");
const btRefreshToken = document.getElementById("refreshToken");

btHidePanel.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    let results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: _panelDisplay,
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.panelDisplay == "none") {
            btHidePanel.innerText = "Показать админ панель";
        } else {
            btHidePanel.innerText = "Скрыть админ панель";
        }
    }
);

chrome.storage.local.get("panelDisplay", function(data) {
    if(typeof data.panelDisplay == "undefined") {
        // That's kind of bad
    } else {
        if(data.panelDisplay == "none") {
            btHidePanel.innerText = "Показать админ панель";
        } else {
            btHidePanel.innerText = "Скрыть админ панель";
        }
    }
});


function _panelDisplay() {
    chrome.storage.local.get("panelDisplay", function(data) {
        var dsiplay;
        var panel = document.getElementById("panel");
        if(panel) {
            if(data.panelDisplay == 'none') {
                dsiplay = "block";
            } else {
                dsiplay = "none";
            }
            panel.style.display = dsiplay;
            chrome.storage.local.set({panelDisplay: dsiplay});
            chrome.runtime.sendMessage({panelDisplay: dsiplay});
        }
    });
}

btToken.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
        const cookies = await chrome.cookies.get({
            name: "user_token",
            url: tab.url
        });
        alert(cookies.value);
    }
});

btRefreshToken.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
        const cookies = await chrome.cookies.get({
            name: "user_refresh_token",
            url: tab.url
        });
        alert(cookies.value);
    }
});

btDeleteCookie.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.url) {
        try {
            let url = new URL(tab.url);
            let message = await deleteDomainCookies(url.hostname);
            var levels = url.hostname.split('.').reverse();
            if(typeof levels[2] != 'undefined') {
                message = await deleteDomainCookies(levels[1]+"."+levels[0]);
            }
            alert(message);
        } catch {}
    }
});

async function deleteDomainCookies(domain) {
    let cookiesDeleted = 0;
    try {
        const cookies = await chrome.cookies.getAll({ domain });

        if (cookies.length === 0) {
            return "No cookies found";
        }

        let pending = cookies.map(deleteCookie);
        await Promise.all(pending);

        cookiesDeleted = pending.length;
    } catch (error) {
        return `Unexpected error: ${error.message}`;
    }

    return `Удалено ${cookiesDeleted} cookie(s).`;
}

function deleteCookie(cookie) {
    const protocol = cookie.secure ? "https:" : "http:";
    const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
    return chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId,
    });
}

