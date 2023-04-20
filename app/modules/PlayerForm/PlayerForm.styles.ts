import { ComponentEnum } from 'enums/ComponentEnum';
import { css } from 'utils/generalUtils';

export const styles = css`
    [is='${ComponentEnum.PlayerForm}'] {
        /* background-color: yellow; */
        display: grid;
        gap: 10px;
        grid-template-columns: 5em auto;
        justify-items: flex-start;
    }
`;
