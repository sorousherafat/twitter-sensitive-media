const clarifai = {
  isImageBlacklisted: async function (image) {
    const options = {
      modelId: "general-image-recognition",
      imageUrl: image.src,
    };

    await chrome.storage.sync
      .get(["blacklistedWords", "clarifaiAccessToken", "clarifaiAppId", "clarifaiUserId"])
      .then(function (data) {
        options.blacklistedWords = new Set(data.blacklistedWords)
        options.accessToken = data.clarifaiAccessToken;
        options.appId = data.clarifaiAppId;
        options.userId = data.clarifaiUserId;
      });


    const raw = JSON.stringify({
      user_app_id: {
        user_id: options.userId,
        app_id: options.appId,
      },
      inputs: [
        {
          data: {
            image: {
              url: options.imageUrl,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + options.accessToken,
      },
      body: raw,
    };

    const response = await fetch(
      "https://api.clarifai.com/v2/models/" +
        options.modelId +
        "/outputs",
      requestOptions
    );

    const data = await response.json();

    const predictions = data["outputs"][0]["data"]["concepts"].map(
      (concept) => concept["name"]
    );

    const isBlacklisted = predictions.some((prediction) =>
      options.blacklistedWords.has(prediction.toLowerCase())
    );

    return isBlacklisted;
  },
};

function removeBlur(event) {
  timeout = setTimeout(() => {
    event.target.classList.remove("blur");
    event.target.removeEventListener("mouseenter", removeBlur);
  }, 3000);
  event.target._sensitive_media_timeout = timeout;
}

function removeNoBlurTimeout(event) {
  clearTimeout(event.target._sensitive_media_timeout);
}

async function handleMedia(image) {
  if (image.height <= 40 && image.width <= 40) return;

  image.parentNode.classList.add("blur");
  image.parentNode.addEventListener("mouseenter", removeBlur);
  image.parentNode.addEventListener("mouseleave", removeNoBlurTimeout);

  isImageBlacklisted = clarifai.isImageBlacklisted;

  if (!(await isImageBlacklisted(image))) {
    image.parentNode.classList.remove("blur");
    image.removeEventListener("mouseenter", removeBlur);
    image.parentNode.removeEventListener("mouseleave", removeNoBlurTimeout);
  }
}

async function addMediaCallback(mutations) {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(async (node) => {
        if (node.tagName && node.tagName.toLowerCase() === "img") {
          await handleMedia(node);
        }
      });
    }
  });
}

const addImagesObserver = new MutationObserver(addMediaCallback);
addImagesObserver.observe(document, { childList: true, subtree: true });
