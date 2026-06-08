import React, { memo } from 'react';
import Slider from 'react-slick';
import { fontSize } from 'styles/theme';
import { StyledBox } from 'styles/carousel';
import { BreakpointsContext } from 'contexts/breakpoints';
import { Arrow } from 'components/carousel.small';

interface Props {
  data: string[];
};

const CarouselPhoto: React.FunctionComponent<Props> = ({
  data,
}: Props) => {
  const slider = React.useRef<Slider>(null);
  const { downLg } = React.useContext(BreakpointsContext);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    draggable: true,
    adaptiveHeight: true,
  };
  const handleNextPrev = React.useCallback((isNext: boolean) => {
    if (isNext) {
      slider.current.slickNext();
    } else {
      slider.current.slickPrev();
    };
  }, []);
  return (
    <StyledBox className="photo">
      <Arrow
        size={(fontSize + (downLg ? 18 : 22)).toString()}
        className="slick-arrow prev"
        onClick={() => handleNextPrev(false)}
      />
      <Slider ref={slider} {...settings}>
        {data.map((v, i) => (
          <div key={i} dangerouslySetInnerHTML={{__html: v}} />
        ))}
      </Slider>
      <Arrow
        size={(fontSize + (downLg ? 18 : 22)).toString()}
        className="slick-arrow next"
        onClick={() => handleNextPrev(true)}
      />
    </StyledBox>
  );
};

CarouselPhoto.defaultProps = {};

export default memo(CarouselPhoto);
