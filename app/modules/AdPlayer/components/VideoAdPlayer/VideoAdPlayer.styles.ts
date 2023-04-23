import { css } from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';

export const styles = css`
    ${ComponentEnum.VideoAdPlayer} {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;
        background-color: blue;

        display: flex;
        justify-content: center;
    }

    ${ComponentEnum.VideoAdPlayer} video {
        width: 100%;
    }
`;
