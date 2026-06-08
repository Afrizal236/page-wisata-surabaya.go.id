import React, { memo } from 'react'
import Slider from 'react-slick'
import { fontSize } from 'styles/theme'
import { StyledBox } from 'styles/carousel.berita'
import { BreakpointsContext } from 'contexts/breakpoints'
import CarouselNewsItem from 'components/carousel.news.item'
import { Arrow } from 'components/carousel.small.berita'
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
        sliderThumb.current?.slickGoTo(next)
      }
    },
  }
  const settingsThumb = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    // Show 4 items by default (desktop), then 3/2/1 on smaller screens
    slidesToShow: data?.length < 4 ? data.length : 4,
    slidesToScroll: 1,
    autoplay: false,
    draggable: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(3, data?.length || 3) } },
      { breakpoint: 960, settings: { slidesToShow: Math.min(2, data?.length || 2) } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  }
  const handleNextPrevThumb = React.useCallback((isNext: boolean) => {
    if (isNext) {
      sliderThumb.current?.slickNext()
    } else {
      sliderThumb.current?.slickPrev()
    }
  }, [])
  return (
    <>
      <StyledBox
        className="content main"
      >
        <Slider ref={slider} {...settings}>
          {data?.map((v, i) => (
            <CarouselNewsItem
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
              variant="main"
            />
          ))}
        </Slider>
      </StyledBox>
      {withThumbnail && (
        <StyledBox className="content thumb" sx={{ mt: 2 }}>
          <Arrow
            size={(fontSize + (downLg ? 18 : 25)).toString()}
            className="slick-arrow prev"
            onClick={() => handleNextPrevThumb(false)}
          />
          <Slider ref={sliderThumb} {...settingsThumb}>
            {data?.map((v, i) => (
              <CarouselNewsItem
                key={i}
                data={v}
                gridSpacing={0}
                truncateTitle={defTruncateTitle - 2}
                fontSizeTitle={defFontSizeProps + 1}
                fontSizeDate={defFontSizeDate}
                withDescription={false}
                route={route}
                variant="thumb"
              />
            ))}
          </Slider>
          <Arrow
            size={(fontSize + (downLg ? 18 : 25)).toString()}
            className="slick-arrow next"
            onClick={() => handleNextPrevThumb(true)}
          />
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
