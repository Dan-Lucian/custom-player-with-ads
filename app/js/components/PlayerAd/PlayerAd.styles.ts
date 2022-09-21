import css from '../../utils/css';

const styles = css`
    player-ad {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;

        display: flex;
        justify-content: center;
    }

    player-ad[hidden] {
        display: none !important;
    }
`;

export default styles;
