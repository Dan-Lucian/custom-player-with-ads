interface IWindowWithPlayerInitialization extends Window {
    initializePlayer?: () => void;
}

export default IWindowWithPlayerInitialization;
