import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { ICardApiData } from '../../constants/types';
import './product.scss';
// Import Swiper styles
import 'swiper/swiper-bundle.min.css';

interface ISlider {
  sliders: ICardApiData[];
  swiperHandler: () => void;
}
export const Slider = ({ sliders, swiperHandler }: ISlider) => {
  return (
    <div className='slider'>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={swiperHandler}
        onSwiper={swiperHandler}>
        {sliders.map((slide, index) => (
          <SwiperSlide key={slide.image}>
            <img src={slide.image} alt={`Variant ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
