import https from 'https';
import fs from 'fs';

const prefix = '.t';

export default function DownloadFiles(name, videoLink, audioLink) {
    if (!name || !videoLink || !audioLink) throw new Error("Missing arguments");

    const locations = [
        `./dump/${name}${prefix}.mp4`,
        `./dump/${name}${prefix}.m4a`
    ]

    const videoStream = fs.createWriteStream(locations[0]);
    const audioStream = fs.createWriteStream(locations[1]);

    return new Promise((resolve, reject) => {
        var filesDownloaded = 0;

        https.get(videoLink, res => {
            res.pipe(videoStream);
            filesDownloaded++;

            if (filesDownloaded === 2) resolve(locations);
        });

        https.get(audioLink, res => {
            res.pipe(audioStream);
            filesDownloaded++;

            if (filesDownloaded === 2) resolve(locations);
        });

        setTimeout(() => reject("Timed out"), 60000);
    });
}