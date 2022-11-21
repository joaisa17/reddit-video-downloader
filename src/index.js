import 'dotenv/config';
//import { exec } from 'child_process';

import downloadFiles from './downloadFiles.js';
import getPostInfo from './getPostInfo.js';
import ffmpeg from './ffmpeg.js';

import fs from 'fs/promises';
import { exists, dirExists } from './exists.js';
import path from 'path';
import url from 'url';

import inquirer from 'inquirer';

const dump = process.env.DUMP ?? './dump';
const template = process.env.FILENAME ?? '{subreddit}-{title}';

(async () => {
    if (!await dirExists(dump)) await fs.mkdir(dump);
})();

//const videos = fs.readFileSync(links).toString().split(/\n/);
//var filesDeleted = 0;

async function awaitLink() {
    const prompt = inquirer.createPromptModule();
    
    const input = await prompt({
        name: 'url',
        type: 'input',

        message: 'Insert a url to a redd.it video'
    });

    const [url, optionalTitle] = input.url.split(/ /);
    if (!url) process.exit();

    const info = await getPostInfo(url);
    if (!info) return awaitLink();

    const videoName = optionalTitle ?? (
        template
            .replace(/{subreddit}/g, info.subreddit.replace(/r\//, ''))
            .replace(/{title}/g, info.title)
    );
    
    const fileName = videoName + '.mp4';
    const videoPath = path.join(dump, fileName);
    const videoExists = await exists(videoPath);

    if (videoExists) {
        const overwriteAnswer = await prompt({
            name: 'overwrite',
            type: 'confirm',

            message: `${videoName} already exists. Overwrite?`
        });

        if (!overwriteAnswer.overwrite) return awaitLink();
        await fs.rm(videoPath);
    }

    const files = await downloadFiles(dump, fileName, info.video, info.audio);

    const resolvedPaths = [
        files[0].replace(/\//g, '\\'),
        files[1].replace(/\//g, '\\')
    ];

    ffmpeg()
        .addInput(resolvedPaths[0])
        .addInput(resolvedPaths[1])

        //.videoCodec('libx265')

        .save(videoPath)
        .on('end', async () => {
            console.log(`Saved ${videoName}`);
            
            fs.rm(resolvedPaths[0]);
            fs.rm(resolvedPaths[1]);

            awaitLink();
        })
}

awaitLink();

/*videos.forEach(async video => {
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
});*/