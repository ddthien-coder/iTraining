type Compare = (o1: any, o2: any) => -1 | 0 | 1;
export class Arrays {
  static isEmpty(array?: Array<any>) {
    if (!array || array.length == 0) return true;
    return false
  }

  static assertNotEmpty(array: Array<any>, mesg?: string) {
    if (!array || array.length == 0) {
      if (!mesg) {
        mesg = `Array cannot not be null or undefined`;
      }
      throw new Error(mesg);
    }
  }

  static isIn(array: Array<any>, val: any) {
    if (!array || array.length == 0) return false;
    for (let sel of array) {
      if (sel == val) return true;
    }
    return false;
  }

  static addTo(array?: Array<any>, ...obj: any) {
    if (!array) array = [];
    for (let sel of obj) array.push(sel);
    return array;
  }

  static removeFrom(array: Array<any>, obj: any) {
    for (let i = 0; i < array.length; i++) {
      let sel = array[i];
      if (sel === obj) {
        array.splice(i, 1);
        break;
      }
    }
    return array;
  }

  static join(array1?: Array<any>, array2?: Array<any>) {
    if (!array1 || !array2) return [];
    let holder: Array<any> = [];
    if (array1) holder.push(...array1);
    if (array2) holder.push(...array2);
    return holder;
  }

  static joinInner(array1: Array<any> | null | undefined, array2: Array<any> | null | undefined, compare: Compare) {
    if (!array1 || !array2) return [];
    let holder: Array<any> = [];

    for (let rec1 of array1) {
      for (let rec2 of array2) {
        if (compare(rec1, rec2) == 0) holder.push(rec1);
      }
    }
    return holder;
  }

  static joinOuter(array1: Array<any> | null | undefined, array2: Array<any> | null | undefined, compare: Compare) {
    let holder: Array<any> = [];
    if (array1) {
      holder.push(...array1);
    }
    if (array2) {
      for (let rec2 of array2) {
        for (let existed of holder) {
          if (compare(existed, rec2) != 0) holder.push(rec2);
        }
      }
    }
    return holder;
  }

  static joinDiff(array1: Array<any> | null | undefined, array2: Array<any> | null | undefined, compare: Compare) {
    if (!array1) return [];
    if (!array2) return [...array1];
    let holder: Array<any> = [];

    for (let rec1 of array1) {
      let added = false;
      for (let rec2 of array2) {
        if (compare(rec1, rec2) == 0) {
          added = true;
          break;
        }
      }
      if (!added) holder.push(rec1);
    }
    return holder;
  }
}