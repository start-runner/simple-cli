import test from 'tape';

import CLI from '../../lib/';

test('basic', t => {
    t.notEqual(
        typeof CLI,
        'undefined',
        'exist'
    );

    t.end();
});
