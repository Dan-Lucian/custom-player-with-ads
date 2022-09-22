enum EnumEventVPAID {
    AdLoaded = 'AdLoaded',
    AdStarted = 'AdStarted',
    AdStopped = 'AdStopped',
    AdSkipped = 'AdSkipped',
    AdSkippableStateChange = 'AdSkippableStateChange', // VPAID 2.0 new event
    AdSizeChange = 'AdSizeChange', // VPAID 2.0 new event
    AdLinearChange = 'AdLinearChange',
    AdDurationChange = 'AdDurationChange', // VPAID 2.0 new event
    AdExpandedChange = 'AdExpandedChange',
    AdRemainingTimeChange = 'AdRemainingTimeChange', // [Deprecated in 2.0] but will be still fired for backwards compatibility
    AdVolumeChange = 'AdVolumeChange',
    AdImpression = 'AdImpression',
    AdVideoStart = 'AdVideoStart',
    AdVideoFirstQuartile = 'AdVideoFirstQuartile',
    AdVideoMidpoint = 'AdVideoMidpoint',
    AdVideoThirdQuartile = 'AdVideoThirdQuartile',
    AdVideoComplete = 'AdVideoComplete',
    AdClickThru = 'AdClickThru',
    AdInteraction = 'AdInteraction', // VPAID 2.0 new event
    AdUserAcceptInvitation = 'AdUserAcceptInvitation',
    AdUserMinimize = 'AdUserMinimize',
    AdUserClose = 'AdUserClose',
    AdPaused = 'AdPaused',
    AdPlaying = 'AdPlaying',
    AdLog = 'AdLog',
    AdError = 'AdError'
}

export default EnumEventVPAID;
