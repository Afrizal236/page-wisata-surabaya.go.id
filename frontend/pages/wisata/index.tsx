import React from 'react'
import { Box } from '@mui/material'
import { BreakpointsContext } from 'contexts/breakpoints'
import WisataContent from 'components/wisata'

const WisataPage: React. FunctionComponent = () => {
  const { downSm } = React.useContext(BreakpointsContext)

  return (
    <Box sx={{
      backgroundImage: 'url(/images/bg-batik.svg)', 
      backgroundSize: '100% auto', // Lebar 100%, tinggi auto agar tidak crop
      backgroundPosition: 'top center',
      backgroundRepeat: 'repeat-y', // Repeat secara vertikal jika konten panjang
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mt: '-90px',
      pt: '120px',
      px: downSm ? 2 : 4,
      pb: downSm ? 4 : 8,
      overflow: 'hidden', // Prevent horizontal scroll
    }}>
      {/* Komponen Wisata Content */}
      <WisataContent />
    </Box>
  )
}

export default WisataPage