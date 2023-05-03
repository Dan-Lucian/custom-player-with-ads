import { css } from 'utils/generalUtils';

export const styles = css`
    .sound-slider-wrapper {
        display: flex;
        align-items: center;
    }

    .sound-slider {
        margin: auto;
        -webkit-appearance: none;
        position: relative;
        overflow: hidden;
        height: 15px;
        width: 80px;
        cursor: pointer;
        border-radius: 0; /* iOS */
    }

    ::-webkit-slider-runnable-track {
        background: #ddd;
    }

    /*
 * 1. Set to 0 width and remove border for a slider without a thumb
 * 2. Shadow is negative the full width of the input and has a spread 
 *    of the width of the input.
 */
    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 15px; /* 1 */
        height: 40px;
        background: #fff;
        box-shadow: -200px 0 0 200px dodgerblue; /* 2 */
        border: 2px solid #999; /* 1 */
    }

    ::-moz-range-track {
        height: 40px;
        background: #ddd;
    }

    ::-moz-range-thumb {
        background: #fff;
        height: 40px;
        width: 15px;
        border: 3px solid #999;
        border-radius: 0 !important;
        box-shadow: -200px 0 0 200px dodgerblue;
        box-sizing: border-box;
    }

    ::-ms-fill-lower {
        background: dodgerblue;
    }

    ::-ms-thumb {
        background: #fff;
        border: 2px solid #999;
        height: 40px;
        width: 15px;
        box-sizing: border-box;
    }

    ::-ms-ticks-after {
        display: none;
    }

    ::-ms-ticks-before {
        display: none;
    }

    ::-ms-track {
        background: #ddd;
        color: transparent;
        height: 40px;
        border: none;
    }

    ::-ms-tooltip {
        display: none;
    }
`;
