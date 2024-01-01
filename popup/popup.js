const keys = [
  "blacklistedWords",
  "clarifaiAccessToken",
  "clarifaiAppId",
  "clarifaiUserId",
];

function loadSettings() {
  chrome.storage.sync.get(["blacklistedWords"]).then(function (data) {
    document.getElementById("blacklistedWords").value =
      data.blacklistedWords?.join(", ") ?? "";
  });

  ["clarifaiAccessToken", "clarifaiAppId", "clarifaiUserId"].forEach(function (
    key
  ) {
    chrome.storage.sync.get([key]).then(function (data) {
      document.getElementById(key).value = data[key] ?? "";
    });
  });
}

function updateSettings(key, value) {
  if (key === "blacklistedWords")
    value = value.split(",").map((word) => word.trim());

  chrome.storage.sync.set({ [key]: value });
}

function handleInputChange(event) {
  const key = event.target.id;
  const value = event.target.value;

  updateSettings(key, value);
}

document.addEventListener("DOMContentLoaded", function () {
  loadSettings();

  keys.forEach(function (key) {
    document.getElementById(key).addEventListener("input", handleInputChange);
  });
});
