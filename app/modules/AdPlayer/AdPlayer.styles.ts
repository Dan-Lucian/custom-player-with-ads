import { css } from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';

export const styles = css`
    ${ComponentEnum.AdPlayer} {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;

        display: flex;
        justify-content: center;
    }

    ${ComponentEnum.AdPlayer}[hidden] {
        display: none !important;
    }
`;
