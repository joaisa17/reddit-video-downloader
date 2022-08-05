import https from 'https';
import fs from 'fs';
import path from 'path';

const prefix = '.t';

export default function DownloadFiles(dump, name, videoLink, audioLink) {
    if (!name || !videoLink || !audioLink) throw new Error("Missing arguments");

    const locations = [
        `${dump}/${name}${prefix}.mp4`,
        `${dump}/${name}${prefix}.m4a`
    ]

    const videoStream = fs.createWriteStream(locations[0]);
    const audioStream = fs.createWriteStream(locations[1]);

    
    return new Promise((resolve, reject) => {
        var filesDownloaded = 0;

        function tryResolve() {
            if (filesDownloaded === 2) resolve(locations);
        }
        
        videoStream.on('finish', () => {
            filesDownloaded++;
            tryResolve();
        });

        audioStream.on('finish', () => {
            filesDownloaded++;
            tryResolve();
        });

        https.get(videoLink, res => {
            res.pipe(videoStream);
        });

        https.get(audioLink, res => {
            res.pipe(audioStream);
        });

        setTimeout(() => reject("Timed out"), 60000);
    });
}