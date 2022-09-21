import css from '../../utils/css';

const styles = css`
    player-ad-video {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;
        background-color: red;

        display: flex;
        justify-content: center;
    }

    player-ad-video video {
        width: 100%;
    }

    [is='button-skip'] {
        background: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        font-size: 20px;
        border: none;
        cursor: pointer;
        color: #fff;
        position: absolute;
        right: 0;
        bottom: 15%;
    }
`;

export default styles;
