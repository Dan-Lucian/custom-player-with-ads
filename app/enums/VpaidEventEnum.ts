export enum VpaidEventEnum {
    AdLoaded = 'AdLoaded',
    AdStarted = 'AdStarted',
    AdStopped = 'AdStopped',
    AdSkipped = 'AdSkipped',
    // VPAID 2.0 new event
    AdSkippableStateChange = 'AdSkippableStateChange',
    // VPAID 2.0 new event
    AdSizeChange = 'AdSizeChange',
    AdLinearChange = 'AdLinearChange',
    // VPAID 2.0 new event
    AdDurationChange = 'AdDurationChange',
    AdExpandedChange = 'AdExpandedChange',
    // [Deprecated in 2.0] but will be still fired for backwards compatibility
    AdRemainingTimeChange = 'AdRemainingTimeChange',
    AdVolumeChange = 'AdVolumeChange',
    AdImpression = 'AdImpression',
    AdVideoStart = 'AdVideoStart',
    AdVideoFirstQuartile = 'AdVideoFirstQuartile',
    AdVideoMidpoint = 'AdVideoMidpoint',
    AdVideoThirdQuartile = 'AdVideoThirdQuartile',
    AdVideoComplete = 'AdVideoComplete',
    AdClickThru = 'AdClickThru',
    // VPAID 2.0 new event
    AdInteraction = 'AdInteraction',
    AdUserAcceptInvitation = 'AdUserAcceptInvitation',
    AdUserMinimize = 'AdUserMinimize',
    AdUserClose = 'AdUserClose',
    AdPaused = 'AdPaused',
    AdPlaying = 'AdPlaying',
    AdLog = 'AdLog',
    AdError = 'AdError'
}
