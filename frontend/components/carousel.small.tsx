import React, { memo } from 'react'
import { Box, CardActionArea } from '@mui/material'
import Slider from 'react-slick'
import _ from 'lodash'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import CarouselItem from 'components/carousel.item'
import { fontSize } from 'styles/theme'
import { StyledBox } from 'styles/carousel'
import { BreakpointsContext } from 'contexts/breakpoints'
import { Menu as MenuType } from 'components/header'
import NavigationIcon from 'public/images/icon/navigasi_next.svg'
import { AccessibilityContext } from 'contexts/accessibility'

interface Props {
  data: MenuType[]
}

const StyledBoxArrow = styled(Box)(({ theme }) => ({
  '&.slick-next, &.next': {
    right: 0,
    transform: 'translate(50%, -50%)',
  },
  '&.slick-prev, &.prev': {
    left: 0,
    transform: 'translate(-50%, -50%) rotate(180deg)',
  },
  '&.slick-next, &.next, &.slick-prev, &.prev': {
    '& .wrapper-svg': {
      '& svg': {
        cursor: 'pointer',
        '& path:nth-of-type(1)': {
          fill: theme.palette.background.paper,
        },
        '& path:nth-of-type(2)': {
          fill: theme.palette.background.paper,
        },
        '& circle': {
          fill: theme.palette.grey.A200,
          opacity: 0.7,
        },
      },
    },
    '&.disabled .wrapper-svg': {
      '& svg': {
        cursor: 'inherit',
        '& path:nth-of-type(1)': {
          fill: theme.palette.mode == 'light' ? theme.palette.grey[300] : theme.palette.grey[600],
        },
        '& circle': {
          fill: theme.palette.mode == 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
        },
      },
    },
  },
  '&.negative': {
    '&.slick-next, &.next, &.slick-prev, &.prev': {
      '& .wrapper-svg': {
        '& svg': {
          '& circle': {
            fill: theme.palette.common.white,
          },
        },
      },
      '&.disabled': {
        '& .wrapper-svg': {
          '& svg': {
            cursor: 'inherit',
            '& path:nth-of-type(1)': {
              fill: theme.palette.secondary.main,
            },
            '& circle': {
              fill: theme.palette.primary.main,
            },
          },
        },
      },
    },
  },
}))

export const Arrow = memo(function Arrow(props: any) {
  const { className, onClick, size } = props
  const accessibility = React.useContext(AccessibilityContext)
  return (
    <StyledBoxArrow
      className={`${className} ${accessibility.css.negative ? 'negative' : ''}`}
      onClick={onClick}
      sx={{
        boxShadow: 0,
        transition: `all 0.2s ease-in-out`,
        '&:hover': {
          boxShadow: 4,
        },
        '&.disabled': {
          '&:hover': {
            boxShadow: 0,
          },
        },
      }}
    >
      <Box
        className="wrapper-svg"
        onClick={onClick}
        sx={{
          '& svg': {
            width: `${size}px`,
            height: `${size}px`,
            display: 'block',
          },
        }}
      >
        <NavigationIcon />
      </Box>
    </StyledBoxArrow>
  )
})

const CarouselSmall: React.FunctionComponent<Props> = ({ data }: Props) => {
  const slider = React.useRef<Slider>(null)
  const { downSm, downLg } = React.useContext(BreakpointsContext)
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: downSm ? 1 : 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    draggable: false,
  }
  const handleNextPrev = React.useCallback((isNext: boolean) => {
    if (isNext) {
      slider.current.slickNext()
    } else {
      slider.current.slickPrev()
    }
  }, [])
  return (
    <StyledBox className="small">
      <Arrow
        size={(fontSize + (downLg ? 18 : 22)).toString()}
        className="slick-arrow prev"
        onClick={() => handleNextPrev(false)}
      />
      <Slider ref={slider} {...settings}>
        {data.map((v, i) => (
          <CardActionArea key={i} component={Link} href={v.url ? v.url : '#'} sx={{ borderRadius: 4 }}>
            <CarouselItem
              // src={`https://surabaya.go.id/uploads/images/surabaya/${v.icon ? v.icon : `${_.snakeCase(v.title)}.svg`
              //   }`}
              src={`https://surabaya.go.id/uploads/images/icons/menu/${`${_.snakeCase(
                v.title
              )}.svg`}`}
              text={v.title}
            />
          </CardActionArea>
        ))}
      </Slider>
      <Arrow
        size={(fontSize + (downLg ? 18 : 22)).toString()}
        className="slick-arrow next"
        onClick={() => handleNextPrev(true)}
      />
    </StyledBox>
  )
}

CarouselSmall.defaultProps = {}

export default memo(CarouselSmall)
