// eslint-disable-next-line import/no-unassigned-import
import 'ses';
import test from 'ava';
// FinalizationRegistry will fix type errors in tests related to network endowment.
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-unused-vars
import FinalizationRegistry from 'globals';

import buildCommonEndowments, {
  EndowmentFactory,
} from './commonEndowmentFactory';

// Note: harden is only defined after calling lockdown
lockdown({
  domainTaming: 'unsafe',
  errorTaming: 'unsafe',
  stackFiltering: 'verbose',
});

const ExpectedNumberOfEndowments = 28;

test('buildCommonEndowments should return an array of endowment factories', (expect) => {
  const commonEndowments: EndowmentFactory[] = buildCommonEndowments();

  expect.is(commonEndowments.length, ExpectedNumberOfEndowments);
  commonEndowments.forEach((endowment) => {
    expect.truthy(endowment.names);
    expect.truthy(endowment.names.length);
    expect.is(typeof endowment.factory, 'function');
  });
});
