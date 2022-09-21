import css from '../../utils/css';

const styles = css`
    player-ad-iframe {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;
    }

    #slot-ad {
        position: absolute;
        top: 0;
        left: 0;

        box-sizing: border-box;
        border: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }

    #slot-video {
        position: absolute;
        top: 0;
        left: 0;

        box-sizing: border-box;
        border: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    iframe {
        display: none;
    }

    controls-player-ad {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        padding: 4px 10px 8px;

        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;

        background: rgba(1, 1, 1, 0.2);
    }

    [is='button-skip-ad'] {
        border: none;
        padding: 0 20px;

        background: yellow;
        font-size: 20px;
        cursor: pointer;
        color: #000;

        align-self: stretch;

        display: flex;
        align-items: center;
    }
`;

export default styles;
