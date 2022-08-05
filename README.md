# Reddit Video Downloader
An application for downloading reddit videos with ease

## Requirements
* [Node.js](https://nodejs.org)
* [FFMPEG](https://ffmpeg.org/download.html)

## Usage
1. Clone the repository to your computer
2. Run `npm i` in a terminal cd-ed into the repository folder
3. Leave links to the reddit posts in videos.txt, separated by a new line (run download.bat once if the file isn't there)
4. Double click download.bat
5. All videos should be located in the dump folder

## Custom Parameters
These can be changed in the .env file

* DUMP - Specifies where on your computer all videos should be saved.
Defaults to a folder named dump within the repository folder.
* LINKS - Specifies where the text file for all the video links is located.
Defaults to videos.txt within the repository folder.
* FILENAME - Lets you customize how each video is named.
Uses `{subreddit}` and `{title}` for variables.
Default value: `{subreddit}-{title}`

## Libraries Used
* axios for getting reddit post info
* https for file requests
* fs for file management
* ffmpeg for compiling video and audio
* dotenv for env config