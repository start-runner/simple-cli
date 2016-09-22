import test from 'tape';
import execa from 'execa';

test('basic', t => {
    execa('babel-node', [ './lib/index.js' ]).catch((error) => {
        t.notEqual(
            error.message.indexOf('Unable to find "tasks.js" file, please check it again'),
            -1,
            'should throw'
        );
        t.end();
    });
});
