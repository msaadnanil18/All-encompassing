import React from 'react';
import { Drawer, AutoComplete, DrawerProps, AutoCompleteProps } from 'antd';

const SearchDrawer = ({
  DrawerProps,
  AutoCompleteProps,
}: {
  DrawerProps?: DrawerProps;
  AutoCompleteProps?: AutoCompleteProps;
}) => {
  const autoCompleteRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    setTimeout(() => {
      autoCompleteRef.current?.focus();
    }, 1);
  }, [DrawerProps?.open]);
  return (
    <Drawer destroyOnClose {...DrawerProps}>
      <AutoComplete {...AutoCompleteProps} ref={autoCompleteRef as any} />
    </Drawer>
  );
};

export default SearchDrawer;
