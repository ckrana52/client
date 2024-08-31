import React from "react";

const InstallApp = () => {
  return (
    <div>
        <h1 className="text-center font-bold text-xl">DOWNLOAD OUR MOBILE APP</h1>
        <a
        href={
            "https://play.google.com/store/apps/details?id=com.welfir.rrrtopup"
        }
        legacyBehavior
        >
          
        <img
            src="/play-image.WEBP"
            className="w-7/12 md:w-4/12 mx-auto"
            alt="Coxgameshop app"
        
        />
        <p className="text-center font-bold text-m">DOWNLOAD NOW</p>
        <a href={"https://play.google.com/store/apps/details?id=com.welfir.rrrtopup"}></a>
        
        </a>
        
    </div>
  );
};

export default InstallApp;