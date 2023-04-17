import { css } from 'utils/generalUtils';
import { ComponentsEnum } from 'enums/ComponentsEnum';

export const styles = css`
    ${ComponentsEnum.AdPlayer} {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;

        display: flex;
        justify-content: center;
    }

    ${ComponentsEnum.AdPlayer}[hidden] {
        display: none !important;
    }
`;
