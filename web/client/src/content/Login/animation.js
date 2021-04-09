const loginAnimation = {
  desktop: {
    transition: {
      type: 'spring',
      bounce: 0.25,
      duration: 0.3,
    },
    initial: { x: 200, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -200, opacity: 0 },
  },
  mobile: {
    transition: {
      duration: 0.18,
    },
    initial: { x: 0, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 0, opacity: 0 },
  },
}

export default loginAnimation
