import React, { memo } from 'react'
import useTextToSpeech from 'hooks/useTextToSpeech'
import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { heightHeader } from 'styles/theme'
import CarouselMain from 'components/carousel.main'
import Layout from 'components/layout'
import Search from 'components/search'
import { fontSize } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import schema from 'types/schemas'

export interface SliderType {
  content?: string
  content_type?: string
  created_at?: string
  feature_image: string
  id: number
  id_lama?: number
  locale?: string
  name?: string
  parent_id?: number
  post_type?: string
  status?: string
  title?: string
  updated_at?: string
  user_id?: number
  viewed_count?: number
}

interface Props {}

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: 0,
  marginTop: 0,
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'url(/images/bg-landing-sby.svg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
  '& .typo1': {
    fontSize: fontSize + 70,
    textTransform: 'uppercase',
    fontWeight: 900,
    textAlign: 'right',
    lineHeight: 1,
     color:
      theme.palette.mode == 'dark' ? theme.palette.background.paper : theme.palette.primary.main,
    WebkitTextStroke: `2px ${theme.palette.primary.main}`,
    WebkitTextFillColor:
      theme.palette.mode == 'dark' ? theme.palette.background.paper : theme.palette.grey[200],
    '&.negative': {
      WebkitTextStroke: `2px ${theme.palette.common.white}`,
    },
  },
  '& .wrapper-svg2': {
    textAlign: 'right',
    '& svg': {
      height: 86,
      transform: 'scale(2) translateY(38%) rotate(90deg)',
      transformOrigin: 'right top',
      '& circle': {
        fill: `${theme.palette.primary.main} !important`,
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: `100vh`,
    paddingTop: 0,
    '& .wrapper-svg1, & .wrapper-svg3': {
      display: 'none',
    },
    '& .wrapper-svg2': {
      '& svg': {
        height: 65,
      },
    },
    '& .typo1': {
      fontSize: fontSize + 34,
    },
  },
}))

const HomeSection1: React.FunctionComponent<Props> = () => {
  const { downSm, downXl } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const { data: contents } = useQuery<schema['schemas']['Organization']>(['contents'])
  const data = React.useMemo(() => contents?.sliders || [], [contents])

  return (
    <StyledBox>
      <Box sx={{ mt: 0, p: 0, width: '100%' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          pt={0}
        >
          <Box width="100%" maxWidth={700} textAlign="center" mb={downSm ? 4 : 1}>
             <img
        src="/images/icon/icon-text-surabaya.svg"
        alt="Surabaya"
        style={{ width: 400, marginBottom: 5, marginTop: 250 }}
      />
            <Box className="wrapper-svg2" sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            </Box>
            <Typography
              textTransform="uppercase"
              textAlign="center"
              fontSize={downSm ? fontSize - 1 + accessibility.fontSize : fontSize + accessibility.fontSize}
              fontWeight={500}
              letterSpacing={downSm ? 1 : 4}
              lineHeight={1.2}
              mb={3}
              tabIndex={0}
              onMouseEnter={e => textToSpeech(e, true)}
              onFocus={e => textToSpeech(e, true)}
              style={{ cursor: accessibility.speech ? 'pointer' : undefined }}
            >
              {`Gotong royong menuju kota dunia yang maju, `}
              <br />
              {`humanis, dan berkelanjutan`}
            </Typography>
            <Box display="flex" justifyContent="center" marginTop={5}>
              <Search />
            </Box>
          </Box>
          <Box width="100%" display="flex" justifyContent="center" alignItems="flex-end" mt={downSm ? 2 : 6}>
            {!!data && <CarouselMain data={data} loading={false} />}
          </Box>
        </Box>
      </Box>
    </StyledBox>
  )
}

HomeSection1.defaultProps = {}

export default memo(HomeSection1)
