const random = (...args: unknown[]): unknown => {
    const min = 0;
    const max = args.length - 1;
    const intRandom = Math.floor(Math.random() * (max - min + 1)) + min;

    return args[intRandom];
};

export default random;
