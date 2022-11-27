export const validateEmail = (email: string) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const normalizeSearchParam = <T>(
    value: any,
    defaultValue: T,
    min?: T,
    max?: T
): T => {
    console.log(value, defaultValue, typeof value, typeof defaultValue);
    if (typeof defaultValue === "number") {
        if (isNaN(value)) {
            return defaultValue;
        } else if (value == null || value == undefined) {
            return defaultValue;
        }
    }
    if (typeof value !== typeof defaultValue) {
        return defaultValue;
    }
    console.log(min, max);
    if (min != undefined && value < min) {
        return defaultValue;
    }
    if (max != undefined && value > max) {
        return defaultValue;
    }
    return value;
};
