import React from "react";
import Box from "./Box";
import Button, { ButtonProps } from "./Button";
import Link, { LinkProps } from "./Link";
import {
  DialogContext,
  DialogContextValue,
  useDialogContext,
} from "./hooks/UseDialog";

export const dialogBaseClasses = "modal fade" as const;

export const getDialogClasses = (props: DialogProps) => {
  return `${dialogBaseClasses} ${props.className}`;
};

export const modalDialogBaseClasses = "modal-dialog" as const;

export const modalDialogSizesMap = {
  sm: "modal-sm",
  lg: "modal-lg",
  xl: "modal-xl",
  fullscreen: "fullscreen",
  "fullscreen-sm-down": "modal-fullscreen-sm-down",
  "fullscreen-md-down": "modal-fullscreen-md-down",
  "fullscreen-lg-down": "modal-fullscreen-lg-down",
  "fullscreen-xl-down": "modal-fullscreen-xl-down",
  "fullscreen-xxl-down": "modal-fullscreen-xxl-down",
} as const;

export const getModalDialogClasses = (props: DialogProps) => {
  return `${modalDialogBaseClasses} ${
    modalDialogSizesMap[props?.modalDialogSize!]
  }`;
};

export type DialogProps = JSX.IntrinsicElements["div"] &
  DialogContextValue & {
    children: React.ReactNode;
    modalDialogSize?: keyof typeof modalDialogSizesMap;
    onClose?: () => void;
  };

export const Dialog = (props: DialogProps) => {
  const domProps = { ...props } as Partial<DialogProps>;
  delete domProps.labelId;

  React.useEffect(() => {
    const dialogRef = document.getElementById(props.id);

    if (!dialogRef || !props.onClose) return;

    dialogRef.addEventListener("hide.bs.modal", props.onClose);

    return () => {
      if (!dialogRef || !props.onClose) return;

      dialogRef.removeEventListener("hide.bs.modal", props.onClose);
    };
  }, []);

  return (
    <DialogContext.Provider value={props}>
      <Box
        as="div"
        {...domProps}
        className={getDialogClasses(props)}
        tabIndex={-1}
        aria-labelledby={props.labelId}
        aria-hidden="true"
      >
        <Box as="div" className={getModalDialogClasses(props)}>
          <Box as="div" className="modal-content">
            {props.children}
          </Box>
        </Box>
      </Box>
    </DialogContext.Provider>
  );
};

export const dialogHeaderBaseClasses = "modal-header" as const;

export const getDialogHeaderClasses = (props: DialogHeaderProps) => {
  return `${dialogHeaderBaseClasses} ${props.className}`;
};

export type DialogHeaderProps = JSX.IntrinsicElements["div"] & {
  title: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export const DialogHeader = (props: DialogHeaderProps) => {
  const { labelId } = useDialogContext();

  const domProps = { ...props };
  delete domProps.action;
  delete domProps.title;

  return (
    <Box as="div" {...domProps} className={getDialogHeaderClasses(props)}>
      <Box as="h1" className="modal-title fs-5" id={labelId}>
        {props.title}
      </Box>
      {props.action ? (
        props.action
      ) : (
        <Box
          as="button"
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      )}
      {props.children ? props.children : null}
    </Box>
  );
};

export const dialogBodyBaseClasses = "modal-body" as const;

export const getDialogBodyClasses = (props: DialogBodyProps) => {
  return `${dialogBodyBaseClasses} ${props.className}`;
};

export type DialogBodyProps = JSX.IntrinsicElements["div"] & {
  children: React.ReactNode;
};

export const DialogBody = (props: DialogBodyProps) => {
  const domProps = { ...props };
  return <Box as="div" {...domProps} className={getDialogBodyClasses(props)} />;
};

export const dialogFooterBaseClasses = "modal-footer" as const;

export const getDialogFooterClasses = (props: DialogFooterProps) => {
  return `${dialogFooterBaseClasses} ${props.className}`;
};

export type DialogFooterProps = JSX.IntrinsicElements["div"] & {
  children: React.ReactNode;
};

export const DialogFooter = (props: DialogFooterProps) => {
  const domProps = { ...props };
  return (
    <Box as="div" {...domProps} className={getDialogFooterClasses(props)} />
  );
};

export type DialogTriggerProps = ButtonProps &
  DialogContextValue & {
    children: React.ReactNode;
  };

export const DialogTrigger = (props: DialogTriggerProps) => {
  const buttonProps = { ...props } as Partial<DialogTriggerProps>;
  delete buttonProps.id;
  delete buttonProps.labelId;

  return (
    <Button
      data-bs-toggle="modal"
      data-bs-target={`#${props.id}`}
      {...buttonProps}
    />
  );
};

export type DialogTriggerLinkProps<Component extends React.ElementType> =
  LinkProps<Component> &
    DialogContextValue & {
      children: React.ReactNode;
    };

export const DialogTriggerLink = <Component extends React.ElementType>(
  props: DialogTriggerLinkProps<Component>
) => {
  const linkProps = { ...props };
  delete linkProps.id;
  delete linkProps.labelId;

  return (
    <Link
      data-bs-toggle="modal"
      data-bs-target={`#${props.id}`}
      {...linkProps}
    />
  );
};

Dialog.Header = DialogHeader;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
Dialog.Trigger = DialogTrigger;
Dialog.TriggerLink = DialogTriggerLink;

export default Dialog;
