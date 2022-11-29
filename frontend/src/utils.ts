interface ObjectWithId {
    id: number;
}
export const filterUnique = (arr: ObjectWithId[]) => {
    return [
        ...arr
            .reduce((acc, val) => {
                acc.set(val.id, val);
                return acc;
            }, new Map())
            .values(),
    ];
};
