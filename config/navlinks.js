import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';
import { BiSupport, BiTransfer } from 'react-icons/bi';
import { IoWalletOutline } from 'react-icons/io5';
import { RiShoppingCartLine } from 'react-icons/ri';
import { VscAccount } from 'react-icons/vsc';
import Button from '../components/Button';
import Devider from '../components/Devider';
import RenderGuard from '../components/RenderGuard';
import UserPopoverMenu from '../components/user-popover-menu/UserPopoverMenu';
import { __whatsapp_support_number_link } from './globalConfig';
import routes from './routes';

const navlinks = [
  {
    icon: <AiOutlineUser size={20} />,
    link: routes.profile.name,
    disabled_for_desktop: true,
    text: 'My Profile',
    auth: true,
  },
  {
    icon: <BiTransfer size={20} />,
    text: 'Add Money',
    link: routes.addMoney.name,
    disabled_for_desktop: true,
    auth: true,
  },
  {
    icon: <RiShoppingCartLine size={20} />,
    text: 'My Orders',
    link: routes.myOrder.name,
    disabled_for_desktop: true,
    auth: true,
  },
  {
    icon: <IoWalletOutline size={20} />,
    text: 'My Transaction',
    link: routes.myWallet.name,
    disabled_for_desktop: true,
    auth: true,
  },
  {
    component: <Devider />,
    auth: true,
    disabled_for_desktop: true,
  },
  {
    disabled_for_desktop: true,
    component: (
      <div className="px-3 mt-3">
        <a
          href={__whatsapp_support_number_link}
          target="_blank"
          rel="noreferrer"
          className="w-full h-full _btn flex items-center justify-center gap-2"
        >
          <BiSupport size={20} />
          Support
        </a>
      </div>
    ),
  },
  {
    component: (
      <div className="px-2">
        <Link href={routes.register.name}>
          <a>
            <Button
              text="Regsiter"
              className="bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            />
          </a>
        </Link>
      </div>
    ),
    auth: false,
    disabled_for_mobile_sidebar: true,
  },
  {
    component: (
      <div className="px-4 mt-3">
        <Link href={routes.register.name}>
          <a>
            <Button
              text="Regsiter"
              StartIcon={<VscAccount size={20} />}
              className="w-full outlined"
            />
          </a>
        </Link>
      </div>
    ),
    auth: false,
    disabled_for_desktop: true,
  },
  {
    component: (
      <div className="px-2">
        <Link href={routes.login.name}>
          <a>
            <Button
              text="Login"
              className="bg-transparent hover:bg-blue-500 text-primary-700 font-semibold hover:text-white py-2 px-4 border border-primary-500 hover:border-transparent"
            />
          </a>
        </Link>
      </div>
    ),
    auth: false,
    disabled_for_mobile_sidebar: true,
  },
  {
    disabled_for_mobile_sidebar: true,
    component: (
      <RenderGuard>
        <UserPopoverMenu />
      </RenderGuard>
    ),
    auth: true,
  },
];

export default navlinks;
