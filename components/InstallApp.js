import React from "react";

const InstallApp = () => {
  return (
    <div>
        <h1 className="text-center font-bold text-xl">DOWNLOAD OUR MOBILE APP</h1>
        <a
        href={
            "https://play.google.com/store/apps/details?id=com.top.coxgameshop"
        }
        legacyBehavior
        >
        <img
            src="/google-play.png"
            className="w-7/12 md:w-4/12 mx-auto"
            alt="Coxgameshop app"
        />
        </a>
    </div>
  );
};

export default InstallApp;