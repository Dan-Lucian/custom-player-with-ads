import css from '../../utils/css';

const styles = css`
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

        background: rgba(1, 1, 1, 0.5);
    }

    controls-player-ad[hidden] {
        display: none;
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
