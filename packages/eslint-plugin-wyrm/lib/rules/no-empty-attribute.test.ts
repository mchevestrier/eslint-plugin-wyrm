import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-empty-attribute.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`className` attribute is not empty #docs',
      code: `
function Foo() {
  return <div className="cls" />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`className` attribute value is not a literal',
      code: `
function Foo() {
  return <div className={bar} />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`className` attribute value is a number',
      code: `
function Foo() {
  return <div className={42} />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Boolean attribute',
      code: `
function Foo() {
  return <div className />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `foobar` attribute',
      code: `
function Foo() {
  return <div foobar="" />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `foo:bar` attribute with namespaced name',
      code: `
function Foo() {
  return <div foo:bar="" />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `foo:id` attribute with namespaced name',
      code: `
function Foo() {
  return <div foo:id="" />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `className` attribute (with `options.attributes`)',
      options: [{ attributes: ['foobar'] }],
      code: `
function Foo() {
  return <div className="" />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `src` attribute on a component',
      code: `
function Foo() {
  return <Image src="" />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `src` attribute on a compound component',
      code: `
function Foo() {
  return <Quux.Image src="" />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Empty `className` attribute #docs',
      code: `
function Foo() {
  return <div className="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `foobar` attribute (with `options.attributes`)',
      options: [{ attributes: ['foobar'] }],
      code: `
function Foo() {
  return <div foobar="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `id` attribute #docs',
      code: `
function Foo() {
  return <div id="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `className` attribute with expression container',
      code: `
function Foo() {
  return <div className={''} />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },

    // All default attributes:

    {
      name: 'Empty `action` attribute',
      code: `
function Foo() {
  return <form action="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `autocomplete` attribute',
      code: `
function Foo() {
  return <input autocomplete="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `className` attribute',
      code: `
function Foo() {
  return <div className="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `colspan` attribute',
      code: `
function Foo() {
  return <div colspan="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `decoding` attribute',
      code: `
function Foo() {
  return <div decoding="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `height` attribute',
      code: `
function Foo() {
  return <img height="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `id` attribute',
      code: `
function Foo() {
  return <div id="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `href` attribute',
      code: `
function Foo() {
  return <a href="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `loading` attribute',
      code: `
function Foo() {
  return <img loading="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `max` attribute',
      code: `
function Foo() {
  return <div max="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `maxlength` attribute',
      code: `
function Foo() {
  return <div maxlength="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `min` attribute',
      code: `
function Foo() {
  return <div min="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `method` attribute',
      code: `
function Foo() {
  return <form method="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `placeholder` attribute',
      code: `
function Foo() {
  return <input placeholder="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `poster` attribute',
      code: `
function Foo() {
  return <div poster="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `rel` attribute',
      code: `
function Foo() {
  return <a rel="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `rowspan` attribute',
      code: `
function Foo() {
  return <div rowspan="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `size` attribute',
      code: `
function Foo() {
  return <div size="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `src` attribute',
      code: `
function Foo() {
  return <img src="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `start` attribute',
      code: `
function Foo() {
  return <div start="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `tabindex` attribute',
      code: `
function Foo() {
  return <div tabindex="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `target` attribute',
      code: `
function Foo() {
  return <a target="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `title` attribute',
      code: `
function Foo() {
  return <div title="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `type` attribute',
      code: `
function Foo() {
  return <input type="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `width` attribute',
      code: `
function Foo() {
  return <img width="" />;
}
`,
      errors: [{ messageId: 'noEmptyAttribute' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
