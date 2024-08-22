/*
 *
 * Title: Footer
 * Description: --
 * Author: Saymon
 * Date: 25 November 2021 (Thursday)
 *
 */
import Link from 'next/link';
import { AiFillYoutube } from 'react-icons/ai';
import { BsTelegram, BsTelephone, BsWhatsapp } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';
import {
  __support_number,
  __whatsapp_support_number_link,
} from '../config/globalConfig';
import Button from './Button';

function Footer() {
  return (
    <footer className="mt-auto bg-[#475dcb] border-t border-gray-200">
      {/* Footer Top --Start-- */}
      <div className="container pb-5 pt-8">
        <div className="grid grid-cols-1 md:justify-start md:grid-cols-[33.33%,33.33%,33.33%] gap-12">
          <div>
            <h3 className="text-base text-white font-normal tracking-[2px] uppercase mb-10 text-center md:text-left">
              Support
            </h3>

            <a
              href="https://t.me/rrrtopup526"
              target="_blank"
              rel="noreferrer"
            >

              <div className="flex items-center rounded-full border border-white border-opacity-25 hover:border-opacity-60 mb-4">
                <div
                  className="
                  flex items-center justify-center flex-shrink-0 px-4 py-3 border-r border-white border-opacity-25"
                >
                  <BsTelegram size={25} color="#f6f2ef" />
                </div>

                <div className="px-3 py-2.5">
                  <p className="text-white text-opacity-70 text-md">
                    9AM - 11PM
                  </p>
                  <p className="text-xl font-medium text-white mt-1">
                    Telegram Helpline 
                  </p>
                </div>
                
              </div>
              
            </a>

            <a
              href="https://t.me/rrrtopup"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center rounded-full border border-white border-opacity-25 hover:border-opacity-60 mb-4">
                <div
                  className="
                  flex items-center justify-center flex-shrink-0 px-4 py-3 border-r border-white border-opacity-25"
                >
                  <BsTelegram size={25} color="#f6f2ef" />
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-white text-opacity-70 text-md">
                    Telegram Group
                  </p>
                  <p className="text-xl font-medium text-white mt-1">
                    Join Now
                  </p>
                </div>
              </div>
              
            </a>

          </div>
          <div>
            <h3 className="text-base text-white font-normal tracking-[2px] uppercase mb-10 text-center md:text-left">
              About
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Link href="/terms-condition">
                  <a className="text-sm text-center md:text-left text-white text-opacity-70 hover:text-opacity-100 cursor-pointer block mb-3 last:mb-0">
                    {'Terms & condition'}
                  </a>
                </Link>
                <Link href="/privacy-policy">
                  <a className="text-sm text-center md:text-left text-white text-opacity-70 hover:text-opacity-100 cursor-pointer block mb-3 last:mb-0">
                    Privacy Policy
                  </a>
                </Link>
                <Link href="/shipment-info">
                  <a className="text-sm text-center md:text-left text-white text-opacity-70 hover:text-opacity-100 cursor-pointer block mb-3 last:mb-0">
                    Shipment Info
                  </a>
                </Link>
                <Link href="/refund-return-policy">
                  <a className="text-sm text-center md:text-left text-white text-opacity-70 hover:text-opacity-100 cursor-pointer block mb-3 last:mb-0">
                    Refund and Return Policy
                  </a>
                </Link>
              </div>
              <div>
                <Link href="https://t.me/rrrtopup526">
                  <a className="text-sm text-center md:text-left text-white text-opacity-70 hover:text-opacity-100 cursor-pointer block mb-3 last:mb-0">
                    Contact
                  </a>
                </Link>
                <Link href="/about-us">
                  <a className="text-sm text-center md:text-left text-white text-opacity-70 hover:text-opacity-100 cursor-pointer block mb-3 last:mb-0">
                    About us
                    </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-base text-white font-normal tracking-[2px] uppercase mb-10 text-center md:text-left">
              Stay connected
            </h3>
            <p className="text-white font-semibold mb-1.5 text-sm">RRR TOPUP SHOP</p>
            <div className="flex justify-center md:justify-start mt-2 mb-1.5">
              <p className="text-white text-opacity-70 text-sm">Email:</p>
              <p className="text-white font-semibold text-sm ml-1.5">
                <a href="rrrtopup526@gmail.com">
                  rrrtopup526@gmail.com
                </a>
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-start mt-5 space-x-4">
              <a
                href="https://www.facebook.com/rrrtopup"
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-9 h-9 flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center p-2 bg-white bg-opacity-30 hover:bg-opacity-60">
                  <svg
                    stroke="currentColor"
                    fill="#fff"
                    strokeWidth="0"
                    viewBox="0 0 320 512"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                  </svg>
                </div>
              </a>
              <a
                href="https://www.youtube.com/@RRRTOPUP"
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-9 h-9 flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center p-2 bg-white bg-opacity-30 hover:bg-opacity-60">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    viewBox="0 0 16 16"
                    className="text-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15.841 4.8c0 0-0.156-1.103-0.637-1.587-0.609-0.637-1.291-0.641-1.603-0.678-2.237-0.163-5.597-0.163-5.597-0.163h-0.006c0 0-3.359 0-5.597 0.163-0.313 0.038-0.994 0.041-1.603 0.678-0.481 0.484-0.634 1.587-0.634 1.587s-0.159 1.294-0.159 2.591v1.213c0 1.294 0.159 2.591 0.159 2.591s0.156 1.103 0.634 1.588c0.609 0.637 1.409 0.616 1.766 0.684 1.281 0.122 5.441 0.159 5.441 0.159s3.363-0.006 5.6-0.166c0.313-0.037 0.994-0.041 1.603-0.678 0.481-0.484 0.637-1.588 0.637-1.588s0.159-1.294 0.159-2.591v-1.213c-0.003-1.294-0.162-2.591-0.162-2.591zM6.347 10.075v-4.497l4.322 2.256-4.322 2.241z"></path>
                  </svg>
                </div>
              </a>
              
            </div>
          </div>
        </div>
      </div>
      {/* Footer Top --End-- */}
      <div className="container border-t border-primary-400">
        <div className="flex items-center justify-center flex-col sm:flex-row md:justify-between flex-wrap py-2.5 gap-3">
          <p className="_body2 text-xs text-center sm:text-left text-white ">
            © Copyright {new Date().getFullYear()}. All Rights Reserved.
            <span className="block md:inline text-white">
              {' '}
              Developed by
              <a
                
                className="text-white font-bold"
                rel="noreferrer"
                href="https://www.facebook.com/CKRANA01878/"
              >
                {' '}
                RA SOFT COMPANY
                {' '}
                
              </a>
            </span>
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <a href="https://www.youtube.com/@RRRTOPUP">
              <Button
                className="small outlined red"
                StartIcon={<AiFillYoutube />}
              />
            </a>
            <a href="https://www.facebook.com/rrrtopup">
              <Button className="small outlined" StartIcon={<FaFacebookF />} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
