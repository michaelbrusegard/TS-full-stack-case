import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { useIsMobile } from '@/hooks/use-mobile';

import { cn } from '@/lib/utils';

type BaseProps = {
  children: React.ReactNode;
};

type RootResponsiveDialogProps = BaseProps & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ResponsiveDialogProps = BaseProps & {
  className?: string;
  asChild?: true;
};

const ResponsiveDialog = ({
  children,
  ...props
}: RootResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialog = isMobile ? Drawer : Dialog;

  return <ResponsiveDialog {...props}>{children}</ResponsiveDialog>;
};

const ResponsiveDialogTrigger = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialogTrigger = isMobile ? DrawerTrigger : DialogTrigger;

  return (
    <ResponsiveDialogTrigger className={className} {...props}>
      {children}
    </ResponsiveDialogTrigger>
  );
};

const ResponsiveDialogClose = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialogClose = isMobile ? DrawerClose : DialogClose;

  return (
    <ResponsiveDialogClose className={className} {...props}>
      {children}
    </ResponsiveDialogClose>
  );
};

const ResponsiveDialogContent = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialogContent = isMobile ? DrawerContent : DialogContent;

  return (
    <ResponsiveDialogContent className={className} {...props}>
      {children}
    </ResponsiveDialogContent>
  );
};

const ResponsiveDialogDescription = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialogDescription = isMobile
    ? DrawerDescription
    : DialogDescription;

  return (
    <ResponsiveDialogDescription className={className} {...props}>
      {children}
    </ResponsiveDialogDescription>
  );
};

const ResponsiveDialogHeader = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialogHeader = isMobile ? DrawerHeader : DialogHeader;

  return (
    <ResponsiveDialogHeader className={className} {...props}>
      {children}
    </ResponsiveDialogHeader>
  );
};

const ResponsiveDialogTitle = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialogTitle = isMobile ? DialogTitle : DrawerTitle;

  return (
    <ResponsiveDialogTitle className={className} {...props}>
      {children}
    </ResponsiveDialogTitle>
  );
};

const ResponsiveDialogBody = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  return (
    <div className={cn('px-4 md:px-0', className)} {...props}>
      {children}
    </div>
  );
};

const ResponsiveDialogFooter = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const ResponsiveDialogFooter = isMobile ? DialogFooter : DrawerFooter;

  return (
    <ResponsiveDialogFooter className={className} {...props}>
      {children}
    </ResponsiveDialogFooter>
  );
};

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
};
