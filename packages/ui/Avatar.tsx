import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties } from "react";
import Box from "./Box";
import { textBackgroundsClassesMap } from "./Card";
import Image from "./Image";
import Typography from "./Typography";
import {
  AvatarContext,
  AvatarContextValue,
  useAvatar,
  useAvatarContext,
} from "./hooks/UseAvatar";

export const variantsClassesMap = {
  rounded: "rounded",
  circle: "rounded-circle",
} as const;

export const baseClasses =
  "d-flex justify-content-center align-items-center border-0 h-100" as const;

export const getClasses = (props: AvatarProps) => {
  return `${baseClasses} ${variantsClassesMap[props.variant || "circle"]} ${
    textBackgroundsClassesMap[props.textBackground || "secondary"]
  } ${props.className}`;
};

export const sizeHeightsMap = {
  lg: "3.5rem",
  base: "2.5rem",
  sm: "1.5rem",
} as const;

export const getHeight = (props: AvatarProps): CSSProperties => {
  return {
    maxHeight: `${props.style?.height ?? sizeHeightsMap[props.size ?? "base"]}`,
    minHeight: `${props.style?.height ?? sizeHeightsMap[props.size ?? "base"]}`,
  };
};

export type AvatarProps = JSX.IntrinsicElements["div"] & {
  children?: React.ReactNode;
  alt?: string;
  src?: string;
  variant?: keyof typeof variantsClassesMap;
  size?: keyof typeof sizeHeightsMap;
  textBackground?: keyof typeof textBackgroundsClassesMap;
};

export const Avatar = (props: AvatarProps) => {
  const value = useAvatar(props);

  const domProps = { ...props } as Partial<AvatarProps>;

  delete domProps.alt;
  delete domProps.src;
  delete domProps.variant;
  delete domProps.size;
  delete domProps.textBackground;

  React.useEffect(() => {
    if (!props.src) value.dispatcher({ type: "set-image-error" });
    if (!props.alt) value.dispatcher({ type: "set-alt-error" });
  }, [props.src, props.alt]);

  return (
    <AvatarContext.Provider value={value}>
      <Box
        as="div"
        children={
          <>
            <AvatarImage />
            <AvatarAlt />
            <AvatarIcon />
          </>
        }
        {...domProps}
        className={getClasses(props)}
        style={{
          ...props.style,
          ...getHeight(props),
          aspectRatio: 1,
        }}
      />
    </AvatarContext.Provider>
  );
};

export const computeShowAvatarImage = (
  props: AvatarContextValue<AvatarProps>
) => {
  return props.src && props.state.imageError === false;
};

export const computeShowAvatarAlt = (
  props: AvatarContextValue<AvatarProps>
) => {
  return props.alt && props.state.altError === false;
};

export const AvatarImage = () => {
  const props = useAvatarContext<AvatarProps>();

  return computeShowAvatarImage(props) ? (
    <Image
      src={`${props.src}`}
      onError={() => props.dispatcher({ type: "set-image-error" })}
    />
  ) : null;
};

export const AvatarAlt = () => {
  const props = useAvatarContext<AvatarProps>();

  const [firstName, lastName] = (props.alt || "").split(" ");

  return !computeShowAvatarImage(props) && computeShowAvatarAlt(props) ? (
    <Typography as="small">
      {(firstName ? String(firstName.charAt(0)).toUpperCase() : "") +
        (lastName ? String(lastName.charAt(0)).toUpperCase() : "")}
    </Typography>
  ) : null;
};

export const AvatarIcon = () => {
  const props = useAvatarContext<AvatarProps>();

  return !computeShowAvatarImage(props) && !computeShowAvatarAlt(props) ? (
    <Typography as="small">
      <FontAwesomeIcon icon={faUser} />
    </Typography>
  ) : null;
};

Avatar.Image = AvatarImage;
Avatar.Alt = AvatarAlt;
Avatar.Icon = AvatarIcon;

export default Avatar;
