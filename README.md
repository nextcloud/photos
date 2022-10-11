# Nextcloud Photos

**📸 Your memories under your control**

![Work in progress screenshot of Nextcloud Photos App](screenshots/screenshot1.png)

## Why is this so awesome?

* **📸 Beautiful Photo and Video Timeline**
* **⭐ Favorites and Tagging:** Favorite and tag your photos!
* **Slideshow and easy sharing:** Show slideshows and share your photos or albums easily
* **Albums:** Create albums from your contents

## 🚀 Installation

In your Nextcloud, simply enable the Photos app through the Apps management.
The Nextcloud Photos app is only included in nextcloud v18 and higher.

Consider installing the [preview generator](https://github.com/rullzer/previewgenerator) for pre-generating thumbnails.

## Mobile Photos

Use the Android/iOS App to view your photos. It's possible to auto-upload them.

## Maintainers

* [John Molakvoæ](https://github.com/skjnldsv)

If you'd like to join, just go through the [issues list](https://github.com/nextcloud/photos/issues) and fix some!

## 🏗 Development setup

1. ☁ Clone this into your `apps` folder of your Nextcloud.
1. 👩‍💻 In a terminal, run the command `make dev-setup` to install the dependencies.
1. 🏗 Then to build the Javascript whenever you make changes, run `make build-js`. To create a pull request use `make build-js-production`. Watch changes with: `make watch-js`.
1. ✅ Enable the app through the app management of your Nextcloud.
1. 🎉 Partytime!
1. 💻 Fix easily linting issues with `npm run lint:fix`.

