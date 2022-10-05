interface IOptionsPlayer {
    selector: string;
    playlist: { video: string; streamingManifest: string }[];
}

export default IOptionsPlayer;
