import { css } from '../../../../utils/generalUtils';

const styles = css`
    player-ad-ima {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;
        background-color: blue;

        display: flex;
        justify-content: center;
    }

    #ima-ad-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
`;

export default styles;
