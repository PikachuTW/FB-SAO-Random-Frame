# FB SAO Random Frame

Check the facebook pages: [https://www.facebook.com/saoframes/](https://www.facebook.com/saoframes/)

## Installation

```bash
$ git clone https://github.com/PikachuTW/FB-SAO-Random-Frame.git
$ cd FB-SAO-Random-Frame
$ npm install
```

Create a `.env` file in the root of your project:

```bash
FB_ACCESS_TOKEN = 'Your token'
```

In `index.js`, define your page id and the dictionary of videos:

```js
const pageId = '119729791108950';
const output = 'screenshot/image.png';
const videoDir = 'sao';
```
