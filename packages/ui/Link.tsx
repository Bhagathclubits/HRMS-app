export const baseClasses = "" as const;

export const colorClassesMap = {
  primary: "link-primary",
  secondary: "link-secondary",
  success: "link-success",
  danger: "link-danger",
  warning: "link-warning",
  info: "link-info",
  light: "link-light",
  dark: "link-dark",
  "body-emphasis": "link-body-emphasis",
} as const;

export const getClasses = <
  Component extends React.ElementType<HTMLAnchorElement>
>(
  props: LinkProps<Component>
) => {
  return `${baseClasses} ${colorClassesMap[props.color!]} ${props.className}`;
};

export type TextColor = keyof typeof colorClassesMap;

export type LinkProps<Component extends React.ElementType> =
  Component extends React.ElementType
    ? {
        color?: TextColor;
        component: Component;
      } & React.ComponentProps<Component>
    : JSX.IntrinsicElements["a"] & {
        color?: TextColor;
        component?: Component;
      };

export const Link = <Component extends React.ElementType>(
  props: LinkProps<Component>
) => {
  const Component = (props.component || "a") as React.ElementType;

  const componentProps = { ...props };
  delete componentProps.component;
  delete componentProps.color;

  return <Component {...componentProps} className={getClasses(props)} />;
};

export default Link;
