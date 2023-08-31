export const baseClasses = "link-underline" as const;

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

export const opacityClassesMap = {
  "10": "link-opacity-10",
  "25": "link-opacity-25",
  "50": "link-opacity-50",
  "75": "link-opacity-75",
  "100": "link-opacity-100",
} as const;

export const hoverOpacityClassesMap = {
  "10": "link-opacity-10-hover",
  "25": "link-opacity-25-hover",
  "50": "link-opacity-50-hover",
  "75": "link-opacity-75-hover",
  "100": "link-opacity-100-hover",
} as const;

export const underlineColorClassesMap = {
  primary: "link-underline-primary",
  secondary: "link-underline-secondary",
  success: "link-underline-success",
  danger: "link-underline-danger",
  warning: "link-underline-warning",
  info: "link-underline-info",
  light: "link-underline-light",
  dark: "link-underline-dark",
} as const;

export const underlineOffsetClassesMap = {
  "1": "link-offset-1",
  "2": "link-offset-2",
  "3": "link-offset-3",
} as const;

export const underlineOffsetHoverClassesMap = {
  "1": "link-offset-1-hover",
  "2": "link-offset-2-hover",
  "3": "link-offset-3-hover",
} as const;

export const underlineOpacityClassesMap = {
  "0": "link-underline-opacity-0",
  "10": "link-underline-opacity-10",
  "25": "link-underline-opacity-25",
  "50": "link-underline-opacity-50",
  "75": "link-underline-opacity-75",
  "100": "link-underline-opacity-100",
} as const;

export const underlineOpacityHoverClassesMap = {
  "0": "link-underline-opacity-0-hover",
  "10": "link-underline-opacity-10-hover",
  "25": "link-underline-opacity-25-hover",
  "50": "link-underline-opacity-50-hover",
  "75": "link-underline-opacity-75-hover",
  "100": "link-underline-opacity-100-hover",
} as const;

export const getClasses = <
  Component extends React.ElementType<HTMLAnchorElement>
>(
  props: LinkProps<Component>
) => {
  return `${baseClasses} ${colorClassesMap[props.color!]} ${
    opacityClassesMap[props.opacity!]
  } ${hoverOpacityClassesMap[props.hoverOpacity!]} ${
    underlineColorClassesMap[props.underlineColor!]
  } ${underlineOffsetClassesMap[props.underlineOffset!]} ${
    underlineOffsetHoverClassesMap[props.underlineOffsetHover!]
  } ${underlineOpacityClassesMap[props.underlineOpacity!]} ${
    underlineOpacityHoverClassesMap[props.underlineOpacityHover!]
  } ${props.className}`;
};

export type TextColor = keyof typeof colorClassesMap;

export type Opacity = keyof typeof opacityClassesMap;

export type HoverOpacity = keyof typeof hoverOpacityClassesMap;

export type UnderlineColor = keyof typeof underlineColorClassesMap;

export type UnderlineOffset = keyof typeof underlineOffsetClassesMap;

export type UnderlineOffsetHover = keyof typeof underlineOffsetHoverClassesMap;

export type UnderlineOpacity = keyof typeof underlineOpacityClassesMap;

export type UnderlineOpacityHover =
  keyof typeof underlineOpacityHoverClassesMap;

export type LinkProps<Component extends React.ElementType> =
  Component extends React.ElementType
    ? {
        color?: TextColor;
        opacity?: Opacity;
        hoverOpacity?: HoverOpacity;
        underlineColor?: UnderlineColor;
        underlineOffset?: UnderlineOffset;
        underlineOffsetHover?: UnderlineOffsetHover;
        underlineOpacity?: UnderlineOpacity;
        underlineOpacityHover?: UnderlineOpacityHover;
        component: Component;
      } & React.ComponentProps<Component>
    : JSX.IntrinsicElements["a"] & {
        color?: TextColor;
        opacity?: Opacity;
        hoverOpacity?: HoverOpacity;
        underlineColor?: UnderlineColor;
        underlineOffset?: UnderlineOffset;
        underlineOffsetHover?: UnderlineOffsetHover;
        underlineOpacity?: UnderlineOpacity;
        underlineOpacityHover?: UnderlineOpacityHover;
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
