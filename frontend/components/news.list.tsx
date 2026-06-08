import React, { memo } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { fontSize, borderRadius } from 'styles/theme'
import CarouselNewsItem from 'components/carousel.news.item'
import { BreakpointsContext } from 'contexts/breakpoints'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
  route?: string
}

export const fontSizeTitle = fontSize + 8 // fontsize for list news
export const fontSizeBigger = fontSize + 14 // fontsize for slider title

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .news-item': {
    backgroundColor: theme.palette.mode === 'dark' ?  theme.palette.background.paper : theme.palette.background.paper,
    borderRadius: theme.spacing(borderRadius * 4),
    '& a': {
      display: 'block',
      padding: theme.spacing(5),
      borderRadius: theme.spacing(borderRadius),
      overflow: 'hidden',
      transition: `all 0.2s ease-in-out`,
      color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: '#006462',
        color: theme.palette.common.white,
        '& .inner .MuiBox-root p.title, & .inner .MuiBox-root p.description, & .inner .MuiBox-root p.date': {
          color: theme.palette.text.primary,
        },
      },
      '& .inner .MuiBox-root': {
        display: 'flex',
        flexDirection: 'column',
        '& p': {
          '&.title': {
            margin: theme.spacing(0),
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
            fontWeight: 700,
          },
          '&.description': {
            order: 2,
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
          },
          '&.date': {
            order: 1,
            margin: theme.spacing(0, 0, 2),
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
          },
          '&': {
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
          },
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .news-item': {
      '& a': {
        padding: theme.spacing(3),
      },
    },
    '& .wrapper-svg-section1, & .wrapper-svg-section3': {
      display: 'none',
    },
  },
}))

const NewsList: React.FunctionComponent<Props> = ({ data, route }: Props) => {
  const { downSm } = React.useContext(BreakpointsContext)
  return (
    <BoxStyled>
      <Box className="news-item-container">
        {data.map((v, i) => (
          <Box marginTop={downSm ? 2 : 5} key={i} className="news-item">
            <CarouselNewsItem
              key={i}
              data={v}
              gridImage={4}
              gridContent={8}
              gridSpacing={4}
              fontSizeTitle={downSm ? fontSizeTitle - 5 : fontSizeTitle}
              truncateTitle={80}
              truncateDescription={350}
              withDescription={true}
              route={route}
            />
          </Box>
        ))}
      </Box>
    </BoxStyled>
  )
}

NewsList.defaultProps = {
  route: 'berita',
}

export default memo(NewsList)
  