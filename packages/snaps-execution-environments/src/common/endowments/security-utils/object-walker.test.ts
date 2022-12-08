import { walkPropertiesAndSearchForReference } from './object-walker';

const GLOBAL_THIS = global;
const simpleObject = { simple: 'object' };
const TEST_OBJECT = {
  something: {
    that: {
      is: {
        holding: {
          nested: {
            values: [1, 2, 3],
            and: {
              strings: ['a', 'b', 'c', 'd'],
            },
            or: {
              objects: {
                one: Date,
                two: WebAssembly,
                three: {},
                four: {
                  which: {
                    is: {
                      hiding: {
                        globalThis: {}, // Add global this reference when needed
                      },
                    },
                  },
                },
                five: {
                  is: {
                    empty: {},
                  },
                },
                six: () => true,
              },
            },
          },
        },
      },
    },
  },
  whatever: {
    can: {
      be: {
        here: true,
        or: undefined,
        orMaybe: null,
      },
    },
    simple: simpleObject,
    simpleAgain: simpleObject,
  },
  circular: {
    reference: {
      lives: {
        here: {},
      },
    },
  },
};
TEST_OBJECT.circular.reference.lives.here = TEST_OBJECT;

describe('Object walker', () => {
  it('should not detect given reference in a test object', () => {
    const justRandomPlainObject = { something: 'something' };
    const result = walkPropertiesAndSearchForReference(
      TEST_OBJECT,
      justRandomPlainObject,
    );

    expect(result).toBe(false);
  });

  it('should detect WebAssembly reference in a test object', () => {
    const result = walkPropertiesAndSearchForReference(
      TEST_OBJECT,
      WebAssembly,
    );

    expect(result).toBe(true);
  });

  it('should detect object added to WebAssembly', () => {
    const secretObject = {
      thisObject: {
        is: 'secret',
      },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    WebAssembly.secretObject = secretObject;
    const result = walkPropertiesAndSearchForReference(
      TEST_OBJECT,
      secretObject,
    );

    expect(result).toBe(true);
  });

  it('should detect newly added object to test object', () => {
    const secretObject = new TextDecoder();
    TEST_OBJECT.something.that.is.holding.nested.or.objects.three =
      secretObject;
    const result = walkPropertiesAndSearchForReference(
      TEST_OBJECT,
      secretObject,
    );

    expect(result).toBe(true);
  });

  it('should not detect an empty object', () => {
    const randomEmptyObject = {};
    const result = walkPropertiesAndSearchForReference(
      TEST_OBJECT,
      randomEmptyObject,
    );

    expect(result).toBe(false);
  });

  it('should detect global this inside the test object', () => {
    TEST_OBJECT.something.that.is.holding.nested.or.objects.four.which.is.hiding.globalThis =
      GLOBAL_THIS;
    const result = walkPropertiesAndSearchForReference(
      TEST_OBJECT,
      GLOBAL_THIS,
    );

    expect(result).toBe(true);
  });

  it('should detect global this attached to a function', () => {
    // @ts-expect-error This is intentional hack to test security features
    TEST_OBJECT.something.that.is.holding.nested.or.objects.six.globalThis =
      GLOBAL_THIS;
    const result = walkPropertiesAndSearchForReference(
      TEST_OBJECT,
      GLOBAL_THIS,
    );

    expect(result).toBe(true);
  });

  it('should detect global this inside the TextDecoder instance', () => {
    const textDecoder = new TextDecoder();
    // @ts-expect-error This error is expected because this is security related test
    textDecoder.hiddenReference = GLOBAL_THIS;
    const result = walkPropertiesAndSearchForReference(
      textDecoder,
      GLOBAL_THIS,
    );

    expect(result).toBe(true);
  });

  it('should detect global this inside the object that inherited another one', () => {
    const textDecoder = new TextDecoder();
    // @ts-expect-error This error is expected because this is security related test
    textDecoder.hiddenReference = GLOBAL_THIS;
    const testSubject = Object.create(textDecoder, {
      foo: {
        writable: true,
        configurable: true,
        value: 'something_valuable',
      },
    });
    const finalTestSubject = Object.create(testSubject, {
      foo: {
        writable: true,
        configurable: true,
        value: 'something_final',
      },
    });
    const result = walkPropertiesAndSearchForReference(
      finalTestSubject,
      GLOBAL_THIS,
    );

    expect(result).toBe(true);
  });
});
