import test from 'tape';
import execa from 'execa';

test('basic', (t) => {
  execa('babel-node', [ './lib/index.js' ]).catch(() => {
    t.pass('ok');
    t.end();
  });
});
