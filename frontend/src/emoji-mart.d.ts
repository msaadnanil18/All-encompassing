declare module 'emoji-mart' {
  import React from 'react';

  export interface PickerProps {
    onSelect?: (emoji: any) => void;
  }

  export class Picker extends React.Component<PickerProps> {}
}
