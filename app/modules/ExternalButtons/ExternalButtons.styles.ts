import { css } from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';

export const styles = css`
    ${ComponentEnum.ExternalButtons} {
        padding: 5px;
        border: 2px solid black;
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
