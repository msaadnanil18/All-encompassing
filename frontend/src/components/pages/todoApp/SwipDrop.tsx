import { useState, FC, PropsWithChildren } from 'react';

const app = {
  __type: 'Div',
  children: [
    {
      __type: 'Button',
      __id: 'counter',
      __state: 0,
      onClick: {
        __type: 'Func',
        body: `__context.counter.set(s => s + 1)
        `,
      },
      children: [
        {
          __type: 'Text',
          children: ['Count: '],
        },
        {
          depends: ['counter'],
          __type: 'Value',
          name: 'counter',
        },
      ],
    },

    {
      __type: 'Button',
      onClick: {
        __type: 'Func',
        body: () => {},
      },
      children: [
        {
          __type: 'Div',
          children: [
            {
              __type: 'Text',
              children: ['Hello '],
            },
            {
              __type: 'B',
              children: ['World'],
            },
          ],
        },
      ],
    },
  ],
};

type BaseComponentProps = { __context: any };

const Root: FC<PropsWithChildren & BaseComponentProps> = ({ children }) =>
  children;

const B: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
    BaseComponentProps
> = ({ __context, ...props }) => <b {...props} />;

const Div: FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > &
    BaseComponentProps
> = ({ __context, ...props }) => <div {...props} />;

const Button: FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    BaseComponentProps
> = ({ __context, ...props }) => <button {...props} />;

const Text: FC<PropsWithChildren & BaseComponentProps> = ({ children }) =>
  children;

const Value: FC<BaseComponentProps & { name: string }> = ({
  name,
  __context,
}) => __context[name].value;

const Func = (props: { args: string[]; body: string } & BaseComponentProps) => {
  const func = new Function('__context', ...(props.args || []), props.body);
  return (...args: any) => {
    return func(props.__context, ...args);
  };
};
Func.direct = true;

const Transformer: FC<
  BaseComponentProps & {
    render: any;
  }
> = ({ render, __context }) => {
  const { __type, __id, __state, ...props } = render;

  console.log('rendering:', __id);
  const [state, setState] = useState(__state);

  const Component = (COMPONENTS as any)[__type];

  const transformed = {};
  const childContext = {
    ...__context,
    ...(__id
      ? {
          [__id]: {
            set: setState,
            value: state,
          },
        }
      : {}),
  };

  console.log(childContext, '_____childContext_______');
  const t = (x: any) => {
    if (x.__type) {
      const Child = (COMPONENTS as any)[x.__type];
      if (!Child.direct)
        return <Transformer render={x} __context={childContext} />;
      return Transformer({ render: x, __context: childContext });
    }

    return x;
  };

  for (const key in props) {
    const value = props[key];
    if (Array.isArray(value)) {
      (transformed as any)[key] = value.map(t);
    } else if (typeof value === 'object') {
      (transformed as any)[key] = t(value);
    } else (transformed as any)[key] = value;
  }

  return Component({
    ...transformed,
    __context,
  });
};

const COMPONENTS = { Root, B, Text, Div, Button, Value, Func, Transformer };

function SwipDrop() {
  // console.log(Transformer(app));

  return (
    <>
      <Transformer render={app} __context={{}} />
      {/* <pre>{JSON.stringify(app, null, 2)}</pre> */}
    </>
  );
}

export default SwipDrop;
