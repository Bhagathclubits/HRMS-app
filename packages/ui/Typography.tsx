import Box from "./Box";

export const baseClasses = "" as const;

export const displayLevelsClassesMap = {
  "1": "display-1",
  "2": "display-2",
  "3": "display-3",
  "4": "display-4",
  "5": "display-5",
  "6": "display-6",
} as const;

export const colorsClassesMap = {
  primary: "text-primary",
  "primary-emphasis": "text-primary-emphasis",
  secondary: "text-secondary",
  "secondary-emphasis": "text-secondary-emphasis",
  success: "text-success",
  "success-emphasis": "text-success-emphasis",
  danger: "text-danger",
  "danger-emphasis": "text-danger-emphasis",
  warning: "text-warning",
  "warning-emphasis": "text-warning-emphasis",
  info: "text-info",
  "info-emphasis": "text-info-emphasis",
  light: "text-light",
  "light-emphasis": "text-light-emphasis",
  dark: "text-dark",
  "dark-emphasis": "text-dark-emphasis",
  body: "text-body",
  "body-emphasis": "text-body-emphasis",
  "body-secondary": "text-body-secondary",
  "body-tertiary": "text-body-tertiary",
  black: "text-black",
  "black-50": "text-black-50",
  white: "text-white",
  "white-50": "text-white-50",
} as const;

export const alignsClassesMap = {
  start: "text-start",
  end: "text-end",
  center: "text-center",
  "sm-start": "text-sm-start",
  "sm-end": "text-sm-end",
  "sm-center": "text-sm-center",
  "md-start": "text-md-start",
  "md-end": "text-md-end",
  "md-center": "text-md-center",
  "lg-start": "text-lg-start",
  "lg-end": "text-lg-end",
  "lg-center": "text-lg-center",
  "xl-start": "text-xl-start",
  "xl-end": "text-xl-end",
  "xl-center": "text-xl-center",
  "xxl-start": "text-xxl-start",
  "xxl-end": "text-xxl-end",
  "xxl-center": "text-xxl-center",
} as const;

export const wrapsClassesMap = {
  wrap: "text-wrap",
  nowrap: "text-nowrap",
} as const;

export const transformsClassesMap = {
  lowercase: "text-lowercase",
  uppercase: "text-uppercase",
  capitalize: "text-capitalize",
} as const;

export const fontSizesClassesMap = {
  "1": "fs-1",
  "2": "fs-2",
  "3": "fs-3",
  "4": "fs-4",
  "5": "fs-5",
  "6": "fs-6",
} as const;

export const fontWeightsClassesMap = {
  bold: "fw-bold",
  bolder: "fw-bolder",
  semibold: "fw-semibold",
  medium: "fw-medium",
  normal: "fw-normal",
  light: "fw-light",
  lighter: "fw-lighter",
} as const;

export const fontStylesClassesMap = {
  italic: "fst-italic",
  normal: "fst-normal",
} as const;

export const lineHeightsClassesMap = {
  "1": "lh-1",
  sm: "lh-sm",
  base: "lh-base",
  lg: "lh-lg",
} as const;

export const decorationsClassesMap = {
  underline: "text-decoration-underline",
  "line-through": "text-decoration-line-through",
  none: "text-decoration-none",
} as const;

export const getClasses = <Key extends TypographyAsKeys>(
  props: TypographyProps<Key>
) => {
  return `${baseClasses} ${displayLevelsClassesMap[props.display!]} ${
    colorsClassesMap[props.color!]
  } ${alignsClassesMap[props.align!]} ${wrapsClassesMap[props.wrap!]} ${
    transformsClassesMap[props.transform!]
  } ${fontSizesClassesMap[props.fontSize!]} ${
    fontWeightsClassesMap[props.fontWeight!]
  } ${lineHeightsClassesMap[props.lineHeight!]} ${
    decorationsClassesMap[props.decoration!]
  } ${props.textBreak ? "text-break" : ""} ${
    props.monospace ? "font-monospace" : ""
  } ${props.reset ? "text-reset" : ""} ${
    "lead" in props && props.lead ? "lead" : ""
  } ${props.as === "blockquote" ? "blockquote" : ""} ${
    props.as === "figcaption" ? "blockquote-footer" : ""
  } ${props.className}`;
};

export type TypographyAsKeys =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "mark"
  | "del"
  | "s"
  | "ins"
  | "u"
  | "small"
  | "em"
  | "blockquote"
  | "abbr"
  | "cite"
  | "figcaption";

export type TypographyProps<Key extends TypographyAsKeys> =
  JSX.IntrinsicElements[Key] & {
    display?: keyof typeof displayLevelsClassesMap;
    color?: keyof typeof colorsClassesMap;
    align?: keyof typeof alignsClassesMap;
    wrap?: keyof typeof wrapsClassesMap;
    transform?: keyof typeof transformsClassesMap;
    fontSize?: keyof typeof fontSizesClassesMap;
    fontWeight?: keyof typeof fontWeightsClassesMap;
    fontStyles?: keyof typeof fontStylesClassesMap;
    lineHeight?: keyof typeof lineHeightsClassesMap;
    decoration?: keyof typeof decorationsClassesMap;
    textBreak?: true;
    monospace?: true;
    reset?: true;
  } & (Key extends "p"
      ? { as: Key; lead?: boolean }
      : Key extends "abbr"
      ? { as: Key; title: string }
      : Key extends "cite"
      ? { as: Key; title: string }
      : { as?: Key });

export const Typography = <Key extends TypographyAsKeys>(
  props: TypographyProps<Key>
) => {
  const elementProps = { ...props };

  delete elementProps.display;
  delete elementProps.color;
  delete elementProps.align;
  delete elementProps.wrap;
  delete elementProps.transform;
  delete elementProps.fontSize;
  delete elementProps.fontWeight;
  delete elementProps.fontStyles;
  delete elementProps.lineHeight;
  delete elementProps.decoration;
  delete elementProps.textBreak;
  delete elementProps.monospace;
  delete elementProps.reset;
  delete elementProps.as;
  "lead" in elementProps && delete elementProps.lead;
  "title" in elementProps && delete elementProps.title;

  return (
    <Box as={props.as || "p"} {...elementProps} className={getClasses(props)} />
  );
};

export default Typography;
