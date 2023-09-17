import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  fromLeft?: boolean;
}

const FadeInOnScroll = ({ children, fromLeft = false }: FadeInOnScrollProps) => {
  const direction = fromLeft ? 'translateX(-1000px)' : 'translateX(1000px)';
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  const [isVisible, setVisible] = useState<boolean>(false);

  const fadeIn = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0px)' : direction,
  });

  if (inView && !isVisible) {
    setVisible(true);
  }

  return (
    <div ref={ref}>
      <animated.div style={fadeIn}>{children}</animated.div>
    </div>
  );
};

export default FadeInOnScroll;
