import { ComponentsEnum } from 'enums/ComponentsEnum';
import css from 'utils/css';

export const styles = css`
    [is='${ComponentsEnum.PlayerForm}'] {
        /* background-color: yellow; */
        display: grid;
        gap: 10px;
        grid-template-columns: 5em auto;
        justify-items: flex-start;
    }
`;
