import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCube } from 'swiper';
import { ICardApiData } from '../../constants/types';
import { useMediaQuery } from '@react-hook/media-query';
import 'swiper/css/navigation';

import 'swiper/swiper-bundle.min.css';
import './product.scss';

interface ISlider {
  sliders: ICardApiData[];
  swiperHandler: () => void;
  clickHandler?: () => void;
  clickDoubleHandler?: () => void;
}
export const Slider = ({ sliders, swiperHandler, clickHandler, clickDoubleHandler }: ISlider) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 670px)');
  return (
    <div className='slider' onDoubleClick={clickDoubleHandler} onClick={clickHandler}>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectCube]}
        navigation={!isSmallDevice}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={swiperHandler}
        onSwiper={swiperHandler}
        effect='cube'>
        {sliders.map((slide, index) => (
          <SwiperSlide key={slide.image}>
            <img src={slide.image} alt={`Variant ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
