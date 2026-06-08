import React, { memo } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Slider from 'react-slick'
import hexToRgba from 'hex-to-rgba'
import { fontSize } from 'styles/theme'
import { StyledBox } from 'styles/carousel'
import { BreakpointsContext } from 'contexts/breakpoints'
import NewsItem from 'components/news.item'
import { Arrow } from 'components/carousel.small'
import { fontSizeBigger } from 'components/news.list'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
  slidesToShow?: number
  route?: string
}

const BoxStyled = styled(Box)(({ theme }) => ({
  '& .main': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(2.5),
    overflow: 'hidden',
    '& .slick-arrow': {
      top: '50%',
      '&.next': {
        right: 10,
        transform: 'translate(0, -50%)',
      },
      '&.prev': {
        left: 10,
        transform: 'translate(0, -50%) rotate(180deg)',
      },
    },
    '& .slick-slider': {
      '& .slick-list': {
        '& .slick-track': {
          '& .slick-slide': {
            '& a': {
              position: 'relative',
              '& .MuiGrid-container': {
                position: 'relative',
                '&:before': {
                  content: `''`,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.palette.primary.main,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${hexToRgba(
                    theme.palette.primary.main,
                    0
                  )} 100%)`,
                  zIndex: 1,
                },
                '& .MuiGrid-item': {
                  '& img': {
                    borderRadius: 0,
                    aspectRatio: '3/1.8',
                  },
                  '&:last-of-type': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                  },
                  '& .inner': {
                    padding: theme.spacing(4, 8),
                    color: theme.palette.common.white,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    '& .title': {
                      fontSize: fontSizeBigger,
                      lineHeight: 1.3,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .main': {
      '& .slick-slider': {
        '& .slick-list': {
          '& .slick-track': {
            '& .slick-slide': {
              '& a': {
                '& .MuiGrid-container': {
                  '& .MuiGrid-item': {
                    '& .inner': {
                      padding: theme.spacing(4),
                      '& .title': {
                        fontSize: fontSizeBigger - 14,
                      },
                      '& .date': {
                        fontSize: 11,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}))

const CarouselContent2: React.FunctionComponent<Props> = ({ data, slidesToShow, route }: Props) => {
  const slider = React.useRef<Slider>(null)
  const { downSm, downLg } = React.useContext(BreakpointsContext)
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    draggable: downSm ? true : false,
  }
  const handleNextPrev = React.useCallback((isNext: boolean) => {
    if (isNext) {
      slider.current.slickNext()
    } else {
      slider.current.slickPrev()
    }
  }, [])
  return (
    <BoxStyled>
      <StyledBox className="main">
        {!downSm && (
          <Arrow
            size={(fontSize + (downLg ? 18 : 25)).toString()}
            className="slick-arrow prev"
            onClick={() => handleNextPrev(false)}
          />
        )}
        <Slider ref={slider} {...settings}>
          {data.map((v, i) => (
            <NewsItem
              key={i}
              data={v}
              gridSpacing={0}
              truncateTitle={downSm ? 30 : 50}
              gridImage={12}
              gridContent={12}
              withDescription={false}
              route={route}
            />
          ))}
        </Slider>
        {!downSm && (
          <Arrow
            size={(fontSize + (downLg ? 18 : 25)).toString()}
            className="slick-arrow next"
            onClick={() => handleNextPrev(true)}
          />
        )}
      </StyledBox>
    </BoxStyled>
  )
}

CarouselContent2.defaultProps = {
  slidesToShow: 1,
  route: 'agenda',
}

export default memo(CarouselContent2)
