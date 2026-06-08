import React, { memo } from 'react'
import { Box } from '@mui/material'
import Slider from 'react-slick'
import { fontSize } from 'styles/theme'
import { StyledBox } from 'styles/carousel'
import { BreakpointsContext } from 'contexts/breakpoints'
import NewsItem from 'components/news.item'
import { Arrow } from 'components/carousel.small'
import Element3 from 'public/images/icon/element_3.svg'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
  slidesToShow?: number
  gridSpacing?: number
  truncateTitle?: number
  fontSizeProps?: number
  withDescription?: boolean
  gridImage?: number
  gridContent?: number
  truncateDescription?: number
  withThumbnail?: boolean
  route: string
}

const defGridSpacing = 1
const defTruncateTitle = 35
const defFontSizeProps = fontSize - 1
export const defFontSizeDate = fontSize - 4

const CarouselContent: React.FunctionComponent<Props> = ({
  data,
  slidesToShow,
  gridSpacing,
  truncateTitle,
  truncateDescription,
  fontSizeProps,
  withDescription,
  gridImage,
  gridContent,
  withThumbnail,
  route,
}: Props) => {
  const slider = React.useRef<Slider>(null)
  const sliderThumb = React.useRef<Slider>(null)
  const { downLg } = React.useContext(BreakpointsContext)
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    draggable: false,
    beforeChange: (_current: number, next: number) => {
      if (withThumbnail) {
        sliderThumb.current.slickGoTo(next)
      }
    },
  }
  const settingsThumb = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: data?.length < 4 ? data.length : 4,
    slidesToScroll: 1,
    autoplay: false,
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
    <>
      <StyledBox className="content main">
        <Arrow
          size={(fontSize + (downLg ? 18 : 25)).toString()}
          className="slick-arrow prev"
          onClick={() => handleNextPrev(false)}
        />
        <Slider ref={slider} {...settings}>
          {data?.map((v, i) => (
            <NewsItem
              key={i}
              data={v}
              gridSpacing={gridSpacing}
              truncateTitle={truncateTitle}
              fontSizeTitle={fontSizeProps}
              fontSizeDate={defFontSizeDate}
              withDescription={withDescription}
              gridImage={gridImage}
              gridContent={gridContent}
              truncateDescription={truncateDescription}
              route={route}
            />
          ))}
        </Slider>
        <Arrow
          size={(fontSize + (downLg ? 18 : 25)).toString()}
          className="slick-arrow next"
          onClick={() => handleNextPrev(true)}
        />
      </StyledBox>
      {withThumbnail && (
        <StyledBox className="content thumb">
          <Box className="wrapper-svg-section3">
            <Element3 />
          </Box>
          <Slider ref={sliderThumb} {...settingsThumb}>
            {data?.map((v, i) => (
              <NewsItem
                key={i}
                data={v}
                gridSpacing={defGridSpacing}
                truncateTitle={defTruncateTitle}
                fontSizeTitle={defFontSizeProps}
                fontSizeDate={defFontSizeDate}
                withDescription={false}
                route={route}
              />
            ))}
          </Slider>
        </StyledBox>
      )}
    </>
  )
}

CarouselContent.defaultProps = {
  slidesToShow: 3,
  gridSpacing: defGridSpacing,
  truncateTitle: defTruncateTitle,
  fontSizeProps: defFontSizeProps,
  withDescription: true,
  gridImage: 12,
  gridContent: 12,
  truncateDescription: 90,
  withThumbnail: false,
}

export default memo(CarouselContent)
