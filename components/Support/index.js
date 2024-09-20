/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react';
import { AiOutlineWhatsApp, AiFillMessage } from 'react-icons/ai';
import { BsTelegram, BsMessenger, BsHeadphones } from 'react-icons/bs';
import { FaGooglePlay } from 'react-icons/fa';

export default function Support() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="buttonizer buttonizer-group group-0-0-1">
      <a
        onClick={() => setIsOpen(!isOpen)}
        className={`buttonizer-button button-0-0-21 buttonizer-head ${
          isOpen ? 'opened-0-0-25' : ''
        }`}
        href="#"
      >
        <BsHeadphones className="support-icon" />
        <div className="buttonizer-label label-0-0-24">Support!</div>
      </a>
      <a
        className={`buttonizer-button button-0-0-3 ${
          isOpen ? 'opened-0-0-7' : ''
        }`}
        target="_blank"
        href="https://play.google.com/store/apps/details?id=com.welfir.rrrtopup"
      >
        <FaGooglePlay className="support-icon" />
      </a>
      <a
        className={`buttonizer-button button-0-0-15 ${
          isOpen ? 'opened-0-0-19' : ''
        }`}
        target="_blank"
        rel="noreferrer"
        href="https://t.me/rrrtopup526"
      >
        <BsTelegram className="support-icon" />
      </a>
    </div>
  );
}
