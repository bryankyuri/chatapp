import Cookies from "js-cookie";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
export const LoginPage = () => {
  const { handleLoading } = useContext(AppContext);

  const handleLogin = async () => {
    handleLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      authcode: "mnopqr012uvw345xyz678abc123def456ghi",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://dev.api.asisten.ai/auth/login",
        requestOptions
      );
      const result = await response.json(); // Parse the response as JSON

      // Check if the API response is successful
      if (result.code === "200" && result.status === "success") {
        const token = result.data.token; // Extract the token from the response

        // Store the token in a cookie
        Cookies.set("ut", token, { expires: 7 }); // Expires in 7 days
        window.location.href = "/";
        console.log("Token stored in cookies:", token);
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }

    handleLoading(false);
  };

  return (
    <div className="flex w-full h-screen justify-center items-center flex-col">
      <div className="text-[#19191B] font-semibold text-16px text-center mb-2">
        Selamat Datang di Elevate
      </div>
      <div className="text-center text-[14px] text-[#19191B] mb-8">
        One-Stop Service
        <br />
        for your business and compliance information
      </div>
      <div className="sticky bottom-0 mb-4">
        <button
          onClick={() => handleLogin()}
          className="px-4 py-2 bg-[#e29241] text-white rounded-full w-[358px] mx-auto"
        >
          Masuk
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
