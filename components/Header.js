/* eslint-disable @next/next/no-img-element */
/*
 *
 * Title: Header
 * Description: --
 * Author: Saymon
 * Date: 25 November 2021 (Thursday)
 *
 */
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useContext, useState } from 'react';
import Button from '../components/Button';
import navlinks from '../config/navlinks';
import routes from '../config/routes';
import { globalContext } from '../pages/_app';
import MobileSidebar from './MobileSidebar';
import NoticePopup from './notice-popup/NoticePopup';
import UserPopoverHead from './user-popover-menu/UserPopoverHead';
import Support from './Support/index';

function Header() {
  const router = useRouter();
  const { isAuth, authUser } = useContext(globalContext);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const openSidebar = () => setIsOpenSidebar(true);

  return (
    <>
      <Support />
      <NoticePopup />
      <MobileSidebar
        isOpenSidebar={isOpenSidebar}
        setIsOPenSidebar={setIsOpenSidebar}
      />
      <header className="bg-white border-b border-gray-200 sticky top-0 left-0 w-full z-[100]">
        <div className="container">
          <div className="flex items-center justify-between py-3.5 md:py-2.5">
            {/* Logo --Start-- */}
            <div className="max-w-[120px] md:max-w-[130px]">
              <Link href="/">
                <a>
                  <img src="/logo.png" alt="rrrtopup" />
                </a>
              </Link>
            </div>
            {/* Logo --End-- */}

            {/* Header Search Bar --Start-- Only visible in desktop */}
            <div className="hidden md:block flex-grow md:px-16">
              <form>
                <div className="flex items-center rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search..."
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    className="flex-grow text-base font-medium border-[3px] border-primary-500 border-r-0 rounded-md py-2 px-4 outline-none"
                  />
                  <Button
                    className="!border-[3px] border-primary-500 !rounded-md !rounded-tl-none !rounded-bl-none"
                    type="submit"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
            {/* Header Search Bar --End-- */}

            {/* Nav --Start-- */}
            <nav className="hidden md:block">
              <ul className="flex items-center justify-end gap-2">
                {navlinks.map((navLink, index) => {
                  const { disabled_for_desktop, component, text, link, auth } =
                    navLink;

                  if (disabled_for_desktop) return null;
                  if (auth !== undefined && auth !== isAuth) return null;
                  if (component) return <li key={index}>{component}</li>;
                  if (text && link)
                    return (
                      <li key={index}>
                        <Link href={link || '#'}>
                          <a
                            className={`_body2 font-semibold text-gray-500 hover:text-primary-600 duration-150 ${
                              router.route === link ? 'text-primary-600' : ''
                            }`}
                          >
                            {text}
                          </a>
                        </Link>
                      </li>
                    );

                  return null;
                })}
              </ul>
            </nav>
            {/* Nav --End-- */}
            {/* User Avatar or hamburger menu to open mobile sidebar --Start-- */}
            <div className="md:hidden" onClick={openSidebar}>
              {isAuth && <UserPopoverHead />}
            </div>

            {!isAuth && (
              <div className="flex items-center gap-3 md:hidden">
                <Button className="bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <Link href={routes.register.name}>
                    <a>Register</a>
                  </Link>
                </Button>
                <Button className="bg-transparent hover:bg-blue-500 text-primary-700 font-semibold hover:text-white py-2 px-4 border border-primary-500 hover:border-transparent">
                  <Link href={routes.login.name}>
                    <a>Login</a>
                  </Link>
                </Button>
              </div>
            )}
            {/* User Avatar or hamburger menu to open mobile sidebar --End-- */}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
