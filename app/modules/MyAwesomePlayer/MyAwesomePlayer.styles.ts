import { css } from 'utils/generalUtils';

export const styles = css`
    :host {
        box-sizing: border-box;
        background: green;
        display: inline-block;
        font-size: 0;
        position: relative;
    }

    #player-container {
        bottom: 0;
        right: 0;
    }

    video {
        display: block;
    }

    player-controls {
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

    .hoverable-control {
        width: 40px;
        height: 40px;
        padding: 0;
        background-color: transparent;
        border: none;
        cursor: pointer;
        position: relative;
        z-index: 10;
    }

    .hoverable-control::after {
        content: '';
        transform: scale(0);
        transition: all 0.15s ease-in-out;
        height: 100%;
        width: 100%;
        opacity: 0;
        background-color: #fff;
        border-radius: 100%;
        display: block;
        position: absolute;
        z-index: 1;
        left: 50%;
        margin-left: -50%;
        margin-top: -50%;
        top: 50%;
    }

    .hoverable-control:hover::after {
        content: '';
        transform: scale(1);
        transition: all 0.15s ease-in-out;
        height: 100%;
        width: 100%;
        opacity: 0.4;
        background-color: #fff;
        border-radius: 100%;
        display: block;
        position: absolute;
        z-index: -1;
        left: 50%;
        margin-left: -50%;
        margin-top: -50%;
        top: 50%;
    }

    .rotated180 {
        transform: rotate(180deg);
    }

    .spacer {
        flex-grow: 1;
    }
`;
