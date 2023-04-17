import srcVideoBunnyQualities from 'assets/videos/bunny-quality/video/bunny-480.mp4';
import streamingManifestBunnyQualities from 'assets/videos/bunny-quality/streaming/bunny-quality.m3u8';
import srcVideoBunny from 'assets/videos/bunny/video/bunny.mp4';
import streamingManifestBunny from 'assets/videos/bunny/streaming/bunny.m3u8';
import srcVideoBunnyLong from 'assets/videos/bunny-long/video/bunny-long.mp4';
import streamingManifestBunnyLong from 'assets/videos/bunny-long/streaming/bunny-long.m3u8';
import srcVideoStronger from 'assets/videos/stronger/video/stronger.mp4';
import streamingManifestStronger from 'assets/videos/stronger/streaming/stronger.m3u8';
import srcVideoRainingMen from 'assets/videos/raining-men/video/raining-men.mp4';
import streamingManifestRainingMen from 'assets/videos/raining-men/streaming/raining-men.m3u8';

export const PLAYLIST = [
    {
        video: srcVideoBunnyQualities as string,
        streamingManifest: streamingManifestBunnyQualities as string
    },
    {
        video: srcVideoBunny as string,
        streamingManifest: streamingManifestBunny as string
    },
    {
        video: srcVideoBunnyLong as string,
        streamingManifest: streamingManifestBunnyLong as string
    },
    {
        video: srcVideoStronger as string,
        streamingManifest: streamingManifestStronger as string
    },
    {
        video: srcVideoRainingMen as string,
        streamingManifest: streamingManifestRainingMen as string
    }
];
