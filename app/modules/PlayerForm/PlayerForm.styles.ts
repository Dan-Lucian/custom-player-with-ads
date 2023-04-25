import { ComponentEnum } from 'enums/ComponentEnum';
import { css } from 'utils/generalUtils';

export const styles = css`
    [is='${ComponentEnum.PlayerForm}'] {
        /* background-color: yellow; */
        padding: 5px;
        border: 2px solid black;
        font-size: 20px;
    }

    .input-container {
        display: grid;
        gap: 10px;
        grid-template-columns: 5em auto;
        justify-items: flex-start;
    }
`;
