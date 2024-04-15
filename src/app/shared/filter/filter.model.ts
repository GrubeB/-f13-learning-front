export class Filter<T> {
    property!: string;
    operator!: Operator;
    value!: any;
    valueTo!: any;
    values!: any[];
    customPredicate!: (e: T) => boolean;

    static of(property: string, operator: Operator, value: any, valueTo: any = '') {
        if (Array.isArray(value)) {
            return new Filter(property, operator, '', '', value, () => true);
        }
        return new Filter(property, operator, value, valueTo, [], () => true);
    }
    static customOf(customPredicate: (e: any) => any) {
        return new Filter('', Operator.EQUAL, '', '', [], customPredicate);
    }
    private constructor(
        property: string,
        operator: Operator,
        value: any,
        valueTo: any,
        values: any[],
        customPredicate: (e: T) => boolean,
    ) {
        this.property = property;
        this.operator = operator;
        this.value = value;
        this.valueTo = valueTo;
        this.values = values;
        this.customPredicate = customPredicate;
    }
    getPredicateFunction(): (e: T) => boolean {
        return (e: T) => {
            if (this.property != '') {
                let prop = this.getValueFromObject(e, this.property);
                let include;
                switch (this.operator) {
                    case Operator.EQUAL:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (prop[index] === this.value) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.NOT_EQUAL:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (prop[index] !== this.value) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.LIKE:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if ((prop[index] as string).includes(this.value as string)) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.IN:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (this.values.includes(prop[index])) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.NO_IN:
                        let noinclude = true;
                        for (let index = 0; index < prop.length; index++) {
                            if (this.values.includes(prop[index])) {
                                noinclude = false;
                            }
                        }
                        return noinclude;
                    case Operator.BETWEEN:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (prop[index] >= this.value && prop[0] <= this.valueTo) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.GREATER_THAN:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (prop[index] > this.value) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.GREATER_THAN_OR_EQUAL:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (prop[index] >= this.value) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.LESS_THAN:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (prop[0] < this.value) {
                                include = true;
                            }
                        }
                        return include;
                    case Operator.LESS_THAN_OR_EQUAL:
                        include = false;
                        for (let index = 0; index < prop.length; index++) {
                            if (prop[0] <= this.value) {
                                include = true;
                            }
                        }
                        return include;
                    default:
                        return false;
                }
            } else {
                return this.customPredicate(e);
            }


        };
    }
    private getValueFromObject(obj: any, property: string): any[] {
        let properties: string[] = property.split('.');
        if (properties.length === 1) {
            let prop = this.getShallowValueFromObject(obj, property);
            if (Array.isArray(prop)) {
                return prop;
            } else {
                return [prop];
            }
        }
        let A1: any[] = [obj];
        let A2: any[] = [];
        let A3: any[] = [];
        for (let i = 0; i < properties.length; i++) {
            for (let j = 0; j < A1.length; j++) {
                let a = this.getShallowValueFromObject(A1[j], properties[i]);
                if (a == null) {
                    continue;
                }
                if (!Array.isArray(a)) {
                    A3.push(a);
                } else {
                    for (let index = 0; index < a.length; index++) {
                        A3.push(a[index]);
                    }
                }
                for (let index = 0; index < A3.length; index++) {
                    A2.push(A3[index])
                }
                A3.splice(0);
            }
            A1.splice(0);
            for (let index = 0; index < A2.length; index++) {
                A1.push(A2[index])
            }
            A2.splice(0);
        }
        return A1;
    }
    private getShallowValueFromObject(obj: any, property: string): any {
        return obj[property as keyof typeof obj];
    }
}
export enum Operator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    LIKE = "LIKE",
    IN = "IN",
    NO_IN = "NO_IN",
    BETWEEN = "BETWEEN",
    GREATER_THAN = "GREATER_THAN",
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
    LESS_THAN = "LESS_THAN",
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
}

export enum ConditionOperator {
    AND = "AND",
    OR = "OR",
}