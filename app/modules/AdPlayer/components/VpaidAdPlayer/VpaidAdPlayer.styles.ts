import { css } from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';

export const styles = css`
    ${ComponentEnum.VpaidAdPlayer} {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;
    }

    #ad-slot {
        position: absolute;
        top: 0;
        left: 0;

        box-sizing: border-box;
        border: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }

    iframe {
        display: none;
    }
`;
