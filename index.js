const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { Facebook } = require('fb');
require('dotenv').config();

const fb = new Facebook({ accessToken: process.env.FB_ACCESS_TOKEN });

const pageId = '119729791108950';
const output = 'screenshot/image.png';
const videoDir = 'sao'; // change to the video dictionary

const takeScreenshot = async (videoPath, time) => {
    if (fs.readdirSync('screenshot').length > 0) {
        await promisify(exec)(`rm ${output}`);
    }
    await promisify(exec)(`ffmpeg -ss ${time} -i "${videoPath}" -vframes 1 -q:v 2 ${output}`);
    return output;
};

const getRandomTime = (duration) => (Math.random() * duration).toFixed(3);

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toFixed(3).toString().split('.').map((val, index) => (index === 0 ? val.padStart(2, '0') : val))
        .join('.')}`;
};

const readFiles = async () => {
    const files = fs.readdirSync(videoDir)
        .filter((file) => file.includes('-'))
        .map(async (file) => {
            const name = file.slice(0, -4);
            const videoPath = path.join(videoDir, file);
            let duration = await promisify(exec)(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoPath}`);
            duration = duration.stdout;
            return { name, videoPath, duration };
        });
    return Promise.all(files);
};

let data = [];

const repeat = async () => {
    const { name, videoPath, duration } = data[Math.floor(Math.random() * data.length)];
    const time = getRandomTime(duration);
    await takeScreenshot(videoPath, time);
    const nameArr = name.split('-');
    const res = await fb.api(`/${pageId}/photos`, 'POST', {
        source: fs.createReadStream('screenshot/image.png'),
        caption: `[Random Frame]\n\nSeason ${nameArr[0]} Episode ${nameArr[1]} ${formatTime(time)}`,
        access_token: process.env.FB_ACCESS_TOKEN,
    });
    await promisify(exec)(`rm ${output}`);
    console.log(res);
};

const main = async () => {
    data = await readFiles();
    await repeat();
    await new Promise((resolve) => setTimeout(resolve, 600000));
    await main();
};

main();
