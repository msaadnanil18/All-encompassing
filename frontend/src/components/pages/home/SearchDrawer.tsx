import React from 'react';
import { Drawer, AutoComplete, DrawerProps, AutoCompleteProps } from 'antd';

const SearchDrawer = ({
  DrawerProps,
  AutoCompleteProps,
}: {
  DrawerProps?: DrawerProps;
  AutoCompleteProps?: AutoCompleteProps;
}) => {
  return (
    <Drawer {...DrawerProps}>
      <AutoComplete {...AutoCompleteProps} />
    </Drawer>
  );
};

export default SearchDrawer;
