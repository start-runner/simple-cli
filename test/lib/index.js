import test from 'tape';

import CLI from '../../lib/';

test('basic', t => {
    t.equal(
        typeof CLI,
        'function',
        'is a function'
    );

    t.end();
});
