import test from 'ava'
import { flattenAsyncJSX } from '../sync'

test('flattenAsyncJSX will correctly turn an async structure into a sync one', t => {
  t.plan(1)
  return (
    flattenAsyncJSX(Promise.resolve({
      elementName: 'a',
      children: [
        Promise.resolve({ elementName: 'b' }),
        Observable.of({ elementName: 'c1' }, { elementName: 'c2' }).delay(0),
        {
          elementName: 'd',
          children: [
            Observable.of(1, 2, {
              elementName: 'e',
              children: [
                Promise.resolve(42),
                Observable.of('hello', 'world').delay(0),
              ],
            }).delay(0)
          ],
        },
      ],
    }))
    .toArray()
    .do(history => t.deepEqual(history, [
      {
        elementName: 'a',
        attributes: {},
        children: [
          null,
          null,
          {
            elementName: 'd',
            attributes: {},
            children: [
              null,
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          null,
          {
            elementName: 'd',
            attributes: {},
            children: [
              null,
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c1' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              null,
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c2' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              null,
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c2' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              1,
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c2' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              2,
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c2' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              {
                elementName: 'e',
                attributes: {},
                children: [
                  null,
                  null,
                ]
              },
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c2' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              {
                elementName: 'e',
                attributes: {},
                children: [
                  42,
                  null,
                ]
              },
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c2' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              {
                elementName: 'e',
                attributes: {},
                children: [
                  42,
                  'hello',
                ]
              },
            ],
          },
        ]
      },
      {
        elementName: 'a',
        attributes: {},
        children: [
          { elementName: 'b' },
          { elementName: 'c2' },
          {
            elementName: 'd',
            attributes: {},
            children: [
              {
                elementName: 'e',
                attributes: {},
                children: [
                  42,
                  'world',
                ]
              },
            ],
          },
        ]
      },
    ]))
  )
})
