import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCube } from 'swiper';
import { ICardApiData } from '../../constants/types';
import 'swiper/css/navigation';
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
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectCube]}
        navigation
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
