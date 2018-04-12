import { spreadData } from './api';

describe('spreadData', () => {
  it('Should spread data property on object and remove data property', () => {
    const input = {
      prop1: 1,
      data: {
        prop2: 2,
        prop3: 3,
      },
    };

    expect(spreadData(input)).toEqual({ prop1: 1, prop2: 2, prop3: 3 });
  });

  it('Should not overwrite data in the root of the object', () => {
    const input = {
      prop1: 1,
      data: {
        prop1: 2,
      },
    };

    expect(spreadData(input)).toEqual({ prop1: 1 });
  });

  it('Should work without data property', () => {
    const input = { test: 1 };

    expect(spreadData(input)).toEqual({ test: 1 });
  });
});
