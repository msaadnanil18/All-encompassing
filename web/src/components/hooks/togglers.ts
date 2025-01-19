import { Dispatch, SetStateAction, useState } from 'react';

export const toggleHandlers = (
  func: Dispatch<SetStateAction<boolean>>,
  ...extra: any[]
) => ({
  open: () => func(true, ...(extra as [])),
  close: () => func(false, ...(extra as [])),
  toggle: () => func((state) => !state, ...(extra as [])),
});

export const useTogglers = (initial = false) => {
  const [isOpen, setOpen] = useState<boolean>(initial);

  return {
    state: isOpen,
    ...toggleHandlers(setOpen),
  };
};
