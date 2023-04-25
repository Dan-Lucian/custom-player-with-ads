import { css } from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';

export const styles = css`
    ${ComponentEnum.ExternalButtons} {
        padding: 5px;
        border: 2px solid black;
        font-size: 22px;
    }

    ${ComponentEnum.ExternalButtons} button {
        font-size: 22px;
    }

    .ad-is-playing {
        background: green;
        color: white;
        padding: 3px;
    }

    .external-buttons-error {
        background: red;
        color: white;
        padding: 3px;
    }
`;
