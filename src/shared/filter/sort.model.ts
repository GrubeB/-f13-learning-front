export class Sort<T> {
  property!: string;
  direction!: Direction;
  customGetter!: (e: T) => any;

  static of(property: string, direction: Direction = Direction.ASC) {
    return new Sort(property, direction, () => 0);
  }
  static customOf(customGetter: (e: any) => any, direction: Direction = Direction.ASC) {
    return new Sort('', direction, customGetter);
  }
  private constructor(property: string, direction: Direction, customGetter: (e: T) => any) {
    this.property = property;
    this.direction = direction;
    this.customGetter = customGetter;
  }

  getCompareeFunction(): (e1: T, e2: T) => number {
    return (e1: T, e2: T) => {
      let prop1, prop2;
      if (this.property as keyof T) {
        prop1 = e1[this.property as keyof T];
        prop2 = e2[this.property as keyof T];
      } else {
        prop1 = this.customGetter(e1);
        prop2 = this.customGetter(e2);
      }
      if (prop1 < prop2) {
        return this.direction === Direction.ASC ? -1 : 1;
      } else if (prop1 > prop2) {
        return this.direction === Direction.ASC ? 1 : -1;
      } else {
        return 0;
      }
    };
  }
}

export enum Direction {
  ASC = "ASC",
  DESC = "DESC",
}