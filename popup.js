
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

function renderLinks() {
  const list = document.getElementById("link-list");
  list.innerHTML = "";
  const links = JSON.parse(localStorage.getItem("savedLinks") || "[]");
  links.forEach(url => {
    const a = document.createElement("a");
    a.href = url;
    a.textContent = url.replace(/^https?:\/\//, "").slice(0, 30);
    a.target = "_blank";
    a.style.display = "block";
    a.style.marginBottom = "4px";
    a.style.color = "var(--text-color)";
    a.style.fontSize = "13px";
    list.appendChild(a);
  });
}
