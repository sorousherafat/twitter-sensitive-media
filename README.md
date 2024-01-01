# Twitter Sensitive Media

a Chrome extension that marks Twitter media as sensitive based on a blacklist of words.

## Installation

Right now, this extension is only available in unpacked form.

First, clone this repository:

```sh
git clone https://github.com/sorousherafat/twitter-sensitive-media.git
```

Then follow [this guide](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) on how to install unpacked extensions on Chrome.

## Usage

Currently, this extension uses [clarifai](https://www.clarifai.com/) image recognition API, so you need an account and app with an image recognition model there. Open the extension's popup and enter the following settings:

|Key|Value|
|-|-|
|**Blacklisted Words**|A comma-separated list of words to blacklist.
|**Clarifai Access Token**|Clarifai's personal access token, available in user security settings.|
|**Clarifai User ID**|The user ID you chose at the time of registration at Clarifai.|
|**Clarifai App ID**|The app ID you chose at the time of creating an app with image recognition model at Clarifai.|

Now any images in your Twitter feed that are assumed to contain an object from the blacklist are blurred. Keep your mouse on any of these images for 3 seconds for them to be revealed.

## TODO

- [ ] Add support for videos.
- [ ] Add support for different API providers.
- [ ] Add support for in-browser object detection models.
