type mergable = { [key: string]: mergable | string | number | boolean }

const isObject = (o: any): o is mergable => {
	return typeof o === "object"
}

export const mergeObjects = <T extends mergable, P extends mergable>(
  o1: T,
  o2: P
): T => {
  Object.keys(o2).forEach((k) => {
    const v1 = o1[k];
    const v2 = o2[k];
    if (isObject(v1) && isObject(v2)) {
      o1 = Object.assign(o1, {[k]:mergeObjects(v1, v2)});
    } else {
      o1 = Object.assign(o1, {[k]: o2[k]});
    }
  });
  return o1;
};
