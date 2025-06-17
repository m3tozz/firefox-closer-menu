function includePinned() {
  return document.getElementById("include-pinned").checked;
}

document.getElementById("close-others").addEventListener("click", async () => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const tabsToClose = allTabs.filter(tab => tab.id !== activeTab.id && (includePinned() || !tab.pinned));
  const ids = tabsToClose.map(tab => tab.id);
  if (ids.length) chrome.tabs.remove(ids);
});

document.getElementById("close-left").addEventListener("click", async () => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const tabsToClose = allTabs.filter(tab => tab.index < activeTab.index && (includePinned() || !tab.pinned));
  const ids = tabsToClose.map(tab => tab.id);
  if (ids.length) chrome.tabs.remove(ids);
});

document.getElementById("close-right").addEventListener("click", async () => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const tabsToClose = allTabs.filter(tab => tab.index > activeTab.index && (includePinned() || !tab.pinned));
  const ids = tabsToClose.map(tab => tab.id);
  if (ids.length) chrome.tabs.remove(ids);
});

document.getElementById("close-other-windows").addEventListener("click", async () => {
  const currentWindow = await chrome.windows.getCurrent();
  const allWindows = await chrome.windows.getAll();
  const otherWindows = allWindows.filter(win => win.id !== currentWindow.id);
  for (const win of otherWindows) {
    chrome.windows.remove(win.id);
  }
});

const themeButton = document.getElementById('theme-switch');

function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeButton.textContent = dark ? 'Switch to Light Theme' : 'Switch to Dark Theme';
  localStorage.setItem('darkTheme', dark ? '1' : '0');
}

themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  setTheme(dark);
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('darkTheme') === '1';
  setTheme(savedTheme);
});

document.getElementById("close-all").addEventListener("click", () => {
  chrome.tabs.query({}, (tabs) => {
    const ids = tabs.filter(tab => !tab.pinned).map(tab => tab.id);
    if (ids.length) chrome.tabs.remove(ids);
    window.close();
  });
});

// pmenu
const pwin_text = document.getElementById("pwindow-text");
const pwindow = document.getElementById("pwindow");
let windowOpen = false;

pwin_text.addEventListener("click", () => {
  windowOpen = !windowOpen;

  if (windowOpen) {
    pwindow.style.display = "block";

    requestAnimationFrame(() => {
      const textRect = pwin_text.getBoundingClientRect();
      const winHeight = pwindow.offsetHeight;
      const winWidth = pwindow.offsetWidth;

      const centerLeft = textRect.left + (textRect.width / 2) - (winWidth / 2);

      pwindow.style.top = `${textRect.top - winHeight - 10 + window.scrollY}px`;
      pwindow.style.left = `${centerLeft}px`;
    });
  } else {
    pwindow.style.display = "none";
  }
});
