function setTheme(theme) {
  const body = document.body;
  const themeSwitch = document.getElementById("theme-switch");

  if (theme === "dark") {
    body.classList.add("dark");
    themeSwitch.textContent = "Switch to light theme";
  } else {
    body.classList.remove("dark");
    themeSwitch.textContent = "Switch to dark theme";
  }

  localStorage.setItem("theme", theme);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  document.getElementById("theme-switch").addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });

  document.getElementById("close-others").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, ([activeTab]) => {
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        const ids = tabs.filter(tab => tab.id !== activeTab.id && !tab.pinned).map(tab => tab.id);
        chrome.tabs.remove(ids);
        window.close();
      });
    });
  });

  document.getElementById("close-left").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, ([activeTab]) => {
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        const ids = tabs.filter(tab => tab.index < activeTab.index && !tab.pinned).map(tab => tab.id);
        chrome.tabs.remove(ids);
        window.close();
      });
    });
  });

  document.getElementById("close-right").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, ([activeTab]) => {
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        const ids = tabs.filter(tab => tab.index > activeTab.index && !tab.pinned).map(tab => tab.id);
        chrome.tabs.remove(ids);
        window.close();
      });
    });
  });

  document.getElementById("close-other-windows").addEventListener("click", () => {
    chrome.windows.getCurrent((currentWindow) => {
      chrome.windows.getAll({populate: true}, (windows) => {
        windows.forEach(win => {
          if (win.id !== currentWindow.id) {
            const ids = win.tabs.filter(tab => !tab.pinned).map(tab => tab.id);
            chrome.tabs.remove(ids);
          }
        });
        window.close();
      });
    });
  });

  document.getElementById("close-all").addEventListener("click", () => {
    chrome.tabs.query({}, (tabs) => {
      const ids = tabs.filter(tab => !tab.pinned).map(tab => tab.id);
      chrome.tabs.remove(ids);
      window.close();
    });
  });
});
