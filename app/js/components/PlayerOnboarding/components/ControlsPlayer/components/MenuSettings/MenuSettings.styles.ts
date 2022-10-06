import css from '../../../../../../utils/css';

const styles = css`
    menu-settings {
        position: relative;
    }

    #wrapper-settings {
        padding: 7px 0;

        display: flex;
        flex-direction: column;

        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);

        background: rgba(13, 25, 45, 0.98);
    }

    #wrapper-settings[hidden] {
        display: none !important;
    }

    .button-quality {
        box-sizing: border-box;
        border: 0;
        padding: 0;
        width: 130px;
        height: 32px;

        cursor: pointer;
        background: transparent;
        color: #fff;
        font-size: 13px;
    }

    .button-quality:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .button-quality--active {
        color: #0099ff;
    }
`;

export default styles;
