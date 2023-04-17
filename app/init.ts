import 'mocks/streamingChunks';
import { PLAYLIST } from 'mocks/playlist';
import { IWindowWithPlayerInitialization } from 'interfaces/IWindowWithPlayerInitialization';
import { defineAllComponents } from 'utils/defineAllComponents';
import { isDefined } from 'utils/typeUtils';

defineAllComponents();

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;
if (isDefined(windowWithPlayerInitialization.initializePlayer)) {
    windowWithPlayerInitialization.initializePlayer({
        cssSelector: '#root',
        playlist: PLAYLIST,
        shouldUseIma: false
    });
}
