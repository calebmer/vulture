import util from 'util'
import test from 'ava'
import { diffAsync } from '../diff'

test('diffAsync will diff an async JSX node', t => {
  t.plan(1)
  return (
    diffAsync({
      elementName: 'a',
      children: [
        Observable.of(
          { elementName: 'b' },
          { elementName: 'b', attributes: { hello: 'world' } },
          { elementName: 'b', attributes: { hello: 'moon' }, children: [1] },
          { elementName: 'b', children: [1, 2] },
          { elementName: 'b', children: [1, 3] },
          { elementName: 'b', children: [1] },
          42,
        ).delay(0),
      ],
    })
    .toArray()
    .do(history => t.deepEqual(history, [
      [
        { type: 'NODE_REPLACE', path: [], node: { elementName: 'a', attributes: {}, children: [null] } },
      ],
      [
        { type: 'CHILDREN_ADD', path: [], key: '0', node: { elementName: 'b' } },
      ],
      [
        { type: 'ATTRIBUTE_SET', path: ['0'], name: 'hello', value: 'world' },
      ],
      [
        { type: 'ATTRIBUTE_SET', path: ['0'], name: 'hello', value: 'moon' },
        { type: 'CHILDREN_ADD', path: ['0'], key: '0', node: 1 },
        { type: 'CHILDREN_ORDER', path: ['0'], keys: ['0'] },
      ],
      [
        { type: 'ATTRIBUTE_REMOVE', path: ['0'], name: 'hello' },
        { type: 'CHILDREN_ADD', path: ['0'], key: '1', node: 2 },
        { type: 'CHILDREN_ORDER', path: ['0'], keys: ['0', '1'] },
      ],
      [
        { type: 'NODE_REPLACE', path: ['0', '1'], node: 3 },
      ],
      [
        { type: 'CHILDREN_REMOVE', path: ['0'], key: '1' },
        { type: 'CHILDREN_ORDER', path: ['0'], keys: ['0'] },
      ],
      [
        { type: 'NODE_REPLACE', path: ['0'], node: 42 },
      ],
    ]))
  )
})
