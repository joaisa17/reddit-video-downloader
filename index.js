import 'dotenv/config';
import { exec } from 'child_process';

import GetInfo from './getInfo.js';
import DownloadFiles from './downloadFiles.js';

import fs from 'fs';
import path from 'path';
import url from 'url';

const links = process.env.LINKS;
const dump = process.env.DUMP;

if (!fs.existsSync(links)) fs.appendFileSync(links);
if (!fs.existsSync(dump)) fs.mkdirSync(dump);

const videos = fs.readFileSync(links).toString().split(/\n/);
var filesDeleted = 0;

videos.forEach(async video => {
    const info = await GetInfo(video);
    if (!info) return;

    const template = process.env.FILENAME;

    var fileName = template.replace(/{subreddit}/, info.subreddit.substring(2));
    fileName = fileName.replace(/{title}/, info.title);

    if (fs.existsSync(`${process.env.DUMP}/${fileName}.mp4`)) fileName += '-' + info.id;

    fileName = fileName.replace(/[/<>:"/\\|?*]/g, '-');
    if (fileName.endsWith('-')) fileName = fileName.substring(0, fileName.length - 1);

    const files = await DownloadFiles(dump, fileName, info.video, info.audio);

    const resolvedPaths = [
        files[0].replace(/\//g, '\\'),
        files[1].replace(/\//g, '\\')
    ]

    const command = `ffmpeg -i "${files[0]}" -i "${files[1]}" -c:v copy -c:a aac "${dump}/${fileName}.mp4" & del "${resolvedPaths[0]}" & del "${resolvedPaths[1]}"`;
    exec(command, (err, stdout, stderr) => {
        if (err) console.error(`execution error on ${fileName}: ${err}`);
        else console.log(`Downloaded ${fileName}`);

        filesDeleted++;
        if (filesDeleted === videos.length) {
            console.log("All files downloaded");
            process.exit();
        }
    });
});