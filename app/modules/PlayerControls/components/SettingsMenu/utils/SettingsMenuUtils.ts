import { VideoQualityEnum } from 'modules/HlsWrapper/enums/VideoQualityEnum';
import { TAttributeValue } from 'types/TAttributeValue';
import { isNull } from 'utils/typeUtils';

export function parseQualitiesAttributeValue(value: TAttributeValue): VideoQualityEnum[] {
    if (isNull(value)) {
        return [VideoQualityEnum.Auto];
    }

    const qualities = value.split(',');
    const supportedQualities = Object.values(VideoQualityEnum);

    return qualities.filter((quality) =>
        supportedQualities.includes(quality as VideoQualityEnum)
    ) as VideoQualityEnum[];
}
