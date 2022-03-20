import axios from 'axios';
import GetPost from './getPost.js';

export default async function GetInfo(url) {
    if (typeof url !== 'string') throw new Error(`String expected. Got ${typeof url}`);

    const res = (await axios(`${url}.json`)).data;
    if (!(res instanceof Array)) return;

    const post = GetPost(res[0]);
    
    const video = post.media?.reddit_video?.fallback_url;
    const audio = video?.replace(/DASH_.*\.mp4/, 'DASH_audio.mp4');

    const id = video?.match(/v\.redd\.it\/([^/]*)\//)[1];

    if (!video || !audio || !id || !post.title || !post.subreddit_name_prefixed) return;

    return {
        title: post.title,
        id,

        subreddit: post.subreddit_name_prefixed,

        video,
        audio
    }
}