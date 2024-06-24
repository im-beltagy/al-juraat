import React from 'react';

import { IconButton } from '@mui/material';

import Iconify from '../iconify/iconify';

function CloseButton({ onClose }: { onClose: VoidFunction }) {
  return (
    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 15, right: 6, zIndex: 2 }}>
      <Iconify icon="pajamas:close" />
    </IconButton>
  );
}

export default CloseButton;
