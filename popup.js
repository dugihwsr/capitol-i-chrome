const siteEl = document.getElementById("site");
const statusEl = document.getElementById("status");
const toggleBtn = document.getElementById("toggle");
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");

let currentHost = null;

async function getExcluded() {
  const { excludedSites } = await chrome.storage.sync.get({ excludedSites: [] });
  return excludedSites;
}

async function setExcluded(sites) {
  await chrome.storage.sync.set({ excludedSites: sites });
  render();
}

async function render() {
  const sites = await getExcluded();

  if (currentHost) {
    const isExcluded = sites.includes(currentHost);
    siteEl.textContent = currentHost;
    statusEl.textContent = isExcluded ? "Off on this site" : "On for this site";
    toggleBtn.textContent = isExcluded ? "Re-enable on this site" : "Exclude this site";
    toggleBtn.className = isExcluded ? "enable" : "";
    toggleBtn.disabled = false;
  } else {
    siteEl.textContent = "This page";
    statusEl.textContent = "Chrome doesn't allow extensions here.";
    toggleBtn.textContent = "Not available";
    toggleBtn.disabled = true;
  }

  listEl.replaceChildren(
    ...sites.map((host) => {
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = host;
      const remove = document.createElement("button");
      remove.textContent = "Remove";
      remove.onclick = () => setExcluded(sites.filter((s) => s !== host));
      li.append(name, remove);
      return li;
    })
  );
  emptyEl.hidden = sites.length > 0;
}

toggleBtn.onclick = async () => {
  const sites = await getExcluded();
  setExcluded(
    sites.includes(currentHost)
      ? sites.filter((s) => s !== currentHost)
      : [...sites, currentHost].sort()
  );
};

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  try {
    const url = new URL(tab.url);
    if (url.protocol === "http:" || url.protocol === "https:") currentHost = url.hostname;
  } catch {}
  render();
});
