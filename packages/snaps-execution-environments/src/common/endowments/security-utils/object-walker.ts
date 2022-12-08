/**
 * Object Walker function is testing utility function used to detect when
 * a certain object reference is present within the provided object.
 *
 * Note: Walker will search only for object references, primitive types are omitted.
 * This function cannot work with very large nested structures because of
 * the call stack size limit. Further optimizations are required.
 *
 * @param subject - Object-like structure to be searched for a reference.
 * @param targetReference - Target reference.
 * @returns True if reference to a target is found, false otherwise.
 */
export function walkPropertiesAndSearchForReference(
  subject: unknown,
  targetReference: unknown,
) {
  const seenObjects = new Set();

  /**
   * Recursively walk properties and search for reference.
   *
   * @param currentValue - Object-like structure to be searched for a reference.
   * @param target - Target reference.
   * @returns True if reference to a target is found, false otherwise.
   */
  function walkAndSearch(currentValue: unknown, target: unknown): boolean {
    // Check for nulls or undefined and skip further process
    if (currentValue === undefined || currentValue === null) {
      return false;
    }
    // Check value type and stop process if its a primitive
    const typeOfValue = typeof currentValue;
    if (
      typeOfValue === 'bigint' ||
      typeOfValue === 'boolean' ||
      typeOfValue === 'number' ||
      typeOfValue === 'string' ||
      typeOfValue === 'symbol'
    ) {
      return false;
    }

    // Circular object detection (handling)
    // Check if the same object already exists
    if (seenObjects.has(currentValue)) {
      return false;
    }
    // Add new object to the seen objects set
    // Only the plain objects should be added (Primitive types are skipped)
    seenObjects.add(currentValue);

    // TODO: Investigate and find a reason why this is failing
    //  for some objects, possibly __proto__
    let objectProperties: [string, any][] = [];
    try {
      // Extract object properties
      objectProperties = Object.entries(currentValue);
      // Extract object prototype and add to an array for analysis
      const objectProto = Object.getPrototypeOf(currentValue);
      if (objectProto) {
        objectProperties.push(['__proto__', objectProto]);
      }
    } catch (error) {
      console.log(
        `Could not process object entries. Error message: ${error.message}`,
      );
    }

    return objectProperties.reduce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (result, [key, nestedValue]) => {
        if (result) {
          return true;
        }

        if (nestedValue === target) {
          return true;
        }

        const branchSearchResult = walkAndSearch(nestedValue, target);

        // Circular object detection
        // Once a child node is visited and processed remove it from the set.
        // This will prevent false positives with the same adjacent objects.
        seenObjects.delete(currentValue);

        return branchSearchResult;
      },
      // Starting with negative result
      false,
    );
  }

  return walkAndSearch(subject, targetReference);
}
