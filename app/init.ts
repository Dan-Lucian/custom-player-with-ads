import 'mocks/streamingChunks';
import { PLAYLIST } from 'mocks/playlist';
import { IWindowWithPlayerInitialization } from 'interfaces/IWindowWithPlayerInitialization';
import { isDefined } from 'utils/typeUtils';
import { ComponentsDefiner } from 'modules/ComponentsDefiner/ComponentsDefiner';

ComponentsDefiner.defineModuleLevelComponents();

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;
if (isDefined(windowWithPlayerInitialization.initializePlayer)) {
    windowWithPlayerInitialization.initializePlayer({
        cssSelector: '#root',
        playlist: PLAYLIST,
        shouldUseIma: false
    });
}
