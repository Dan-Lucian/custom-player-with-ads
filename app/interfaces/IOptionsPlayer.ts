interface IOptionsPlayer {
    selector: string;
    playlist: { video: string; streamingManifest: string }[];
    useIma: boolean;
}

export default IOptionsPlayer;
