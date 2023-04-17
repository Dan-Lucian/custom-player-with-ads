import { css } from 'utils/generalUtils';

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
`;

export default styles;
