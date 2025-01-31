export const LoadingPage = () => {
  return (
    <div
      className="w-full h-screen"
      style={{
        background: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "9999",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="w-full flex justify-center flex-col">
        <div className="w-100 text-center mt-4" style={{ color: "white" }}>
          Loading
        </div>
      </div>
    </div>
  );
};
