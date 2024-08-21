
import { useRouter } from 'next/dist/client/router';
import { useContext, useEffect } from 'react';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import routes from '../config/routes';
import Devider from './Devider';
import UserMenuList from './user-popover-menu/UserMenuList';
import navlinks from '/config/navlinks';
import { globalContext } from '/pages/_app';

function MobileSidebar({ isOpenSidebar, setIsOPenSidebar }) {
  const { isAuth, signOut, authUser } = useContext(globalContext);
  const router = useRouter();
  // Close Sidebar
  const closeSidebar = (e) =>
    e?.target?.id === 'sidebar_overly' && setIsOPenSidebar(false);

  const closeSidebarForcely = () => setIsOPenSidebar(false);

  useEffect(() => {
    document.body.style.overflow = isOpenSidebar ? 'hidden' : 'auto';
  }, [isOpenSidebar]);

  return (
    <>
      <div
        onClick={closeSidebar}
        id="sidebar_overly"
        className={`fixed overflow-hidden z-[999999] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ${
          isOpenSidebar
            ? 'transition-opacity opacity-100 duration-500 translate-x-0'
            : 'transition-all delay-500 opacity-0 translate-x-full'
        }`}
      >
        <div
          className={`w-{80%} sm:w-[300px] right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform ${
            isOpenSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="xxs:flex justify-between items-center px-4 py-3">
            {isAuth ? (
              <>
                <div className="flex gap-3 overflow-hidden">
                  <Avatar
                    src={authUser?.avatar || null}
                    text={authUser?.username[0]}
                    size={50}
                  />
                  <div className="pr-1.5 flex-grow-0">
                    <h6 className="_h6 line-clamp-1">{authUser?.username}</h6>
                    <p className="_body1 mb-2.5 text-xs overflow-hidden break-all">
                      {authUser?.email}
                    </p>
                    <Button
                      text="Logout"
                      onClick={() => {
                        closeSidebarForcely();
                        signOut();
                      }}
                      className="small"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  text="Login"
                  onClick={() => {
                    closeSidebarForcely();
                    router.push(routes.login.name);
                  }}
                />
              </>
            )}
          </div>
          <Devider />
          {navlinks.map((navLink, index) => {
            const {
              icon,
              disabled_for_mobile_sidebar,
              text,
              link,
              component,
              auth,
            } = navLink;
            if (disabled_for_mobile_sidebar) return null;
            if (auth !== undefined && auth !== isAuth) return null;
            if (component)
              return (
                <div key={index} onClick={closeSidebarForcely}>
                  {component}
                </div>
              );
            return (
              <div onClick={closeSidebarForcely} key={index}>
                <UserMenuList icon={icon} text={text} link={link} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MobileSidebar;
