import { useNProgress } from "@tanem/react-nprogress";

const Bar = ({ animationDuration, progress }) => (
  <div
    style={{
      background: "#DB1F26",

      height: "3px",
      left: 0,
      marginLeft: `${(-1 + progress) * 100}%`,
      position: "fixed",
      top: 0,
      transition: `margin-left ${animationDuration}ms linear`,
      width: "100%",
      zIndex: 1031,
    }}
  >
    <div
      style={{
        boxShadow: "0 0 10px #DB1F26, 0 0 5px #DB1F26",
        display: "block",
        height: "100%",
        opacity: 1,
        position: "absolute",
        right: 0,
        transform: "rotate(3deg) translate(0px, -4px)",
        width: 100,
      }}
    />
  </div>
);

const Container = ({ animationDuration, children, isFinished }) => (
  <div
    style={{
      opacity: isFinished ? 0 : 1,
      pointerEvents: "none",
      transition: `opacity ${animationDuration}ms linear`,
    }}
  >
    {children}
  </div>
);

export const Progress = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
};
