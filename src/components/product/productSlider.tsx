import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectFade } from 'swiper';
import { ICardApiData } from '../../constants/types';

// Import Swiper styles

import 'swiper/swiper-bundle.min.css';
import './product.scss';

interface ISlider {
  sliders: ICardApiData[];
  swiperHandler: () => void;
  clickHandler: () => void;
}
export const Slider = ({ sliders, swiperHandler, clickHandler }: ISlider) => {
  return (
    <div className='slider' onDoubleClick={clickHandler}>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
        navigation
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={swiperHandler}
        onSwiper={swiperHandler}
        effect='fade'>
        {sliders.map((slide, index) => (
          <SwiperSlide key={slide.image}>
            <img src={slide.image} alt={`Variant ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
