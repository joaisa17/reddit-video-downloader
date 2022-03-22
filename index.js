import { exec } from 'child_process';

import GetInfo from './getInfo.js';
import DownloadFiles from './downloadFiles.js';

import fs from 'fs';

if (!fs.existsSync('videos.txt')) fs.appendFileSync('videos.txt');

const videos = fs.readFileSync('videos.txt').toString().split(/\n/);

var filesDeleted = 0;

function rmcb() {
    filesDeleted++;
    if (filesDeleted >= videos.length * 2) process.exit();
}

videos.forEach(async video => {
    const info = await GetInfo(video);
    if (!info) return;

    var fileName = `${info.subreddit.substring(2)}-${info.title}`;
    if (fs.existsSync(`./dump/${fileName}.mp4`)) fileName += '-' + info.id;

    fileName = fileName.replace(/[/<>:"/\\|?*]/g, '-');
    if (fileName.endsWith('-')) fileName = fileName.substring(0, fileName.length - 1);

    const files = await DownloadFiles(fileName, info.video, info.audio);

    const command = `ffmpeg -i "${files[0]}" -i "${files[1]}" -c:v copy -c:a aac "./dump/${fileName}.mp4"`;
    exec(command, async (err, stdout, stderr) => {
        if (err) console.error(`execution error: ${err}`);

        fs.rm(files[0], rmcb);
        fs.rm(files[1], rmcb);
    });
});