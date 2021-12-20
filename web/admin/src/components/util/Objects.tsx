export class Objects {
  static assertNotNull(obj?: any, mesg?: string) {
    if (!obj) {
      if (!mesg) {
        mesg = `Object cannot not be null or undefined`;
      }
      throw new Error(mesg);
    }
  }

  static assertNull(obj?: any, mesg?: string) {
    if (obj) {
      if (!mesg) {
        mesg = `Expect object is null or undefined`;
      }
      throw new Error(mesg);
    }
  }
}