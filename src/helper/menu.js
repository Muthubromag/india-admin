import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  import FeedbackIcon from '@mui/icons-material/Feedback';
  import FastfoodIcon from '@mui/icons-material/Fastfood';
  import WalletIcon from '@mui/icons-material/Wallet';
  import InventoryIcon from '@mui/icons-material/Inventory';
  import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
  import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
  import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
  import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {NavLink} from "react-router-dom"
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import SettingsIcon from '@mui/icons-material/Settings';


function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


export const items = [
    getItem(<NavLink to='/' className="text-[10px] lg:text-[14px]">Dashboard</NavLink>, '/', <DashboardCustomizeIcon className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='user' className="text-[10px] lg:text-[14px]">Users</NavLink>, '/user', <AccountCircleIcon className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='adminuser' className="text-[10px] lg:text-[14px]">Admin User Management</NavLink>, '/adminuser', <AccountCircleIcon className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<div className='text-[10px] lg:text-[14px]'>Order Management</div>, 'sub2', <ShoppingCartCheckoutIcon className='!text-[17px] !text-[#CD5C08]' />, [
      getItem(<NavLink to='onlineorder' className="text-[10px] lg:text-[14px]">Online Order</NavLink>, '/onlineorder'),
      getItem(<NavLink to="callfororder" className="text-[10px] lg:text-[14px]">Call for order</NavLink>, '/callfororder'),
      getItem(<NavLink to="dinning" className="text-[10px] lg:text-[14px]">Dinning</NavLink>, '/dinning'),
      getItem(<NavLink to="takeaway" className="text-[10px] lg:text-[14px]">Take away</NavLink>, '/takeaway'),
    ]),
    getItem(<div className='text-[10px] lg:text-[14px]'>Menu Management</div>, 'sub1', <FastfoodIcon className='!text-[17px] !text-[#CD5C08]' />, [
      getItem(<NavLink to='category' className="text-[10px] lg:text-[14px]">Cuisines</NavLink>, '/category'),
      getItem(<NavLink to="subcategory" className="text-[10px] lg:text-[14px]">Subcuisines</NavLink>, '/subcategory'),
      getItem(<NavLink to="product" className="text-[10px] lg:text-[14px]">Menu</NavLink>, '/product'),
    ]),
    getItem(<NavLink to='inventory' className="text-[10px] lg:text-[14px]">Inventory Management</NavLink>, '/inventory', <InventoryIcon  className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='wallet' className="text-[10px] lg:text-[14px]">Wallet</NavLink>, '/wallet', <WalletIcon className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='feedback' className="text-[10px] lg:text-[14px]">Feedback</NavLink>, '/feedback', <FeedbackIcon  className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='tablebooking' className="text-[10px] lg:text-[14px]">View bookings</NavLink>, '/tablebooking', <TableRestaurantIcon className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='notifications' className="text-[10px] lg:text-[14px]">Notifications</NavLink>, '/notifications', <NotificationsActiveIcon  className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='banner' className="text-[10px] lg:text-[14px]">Banners</NavLink>, '/banner', <ViewCarouselIcon  className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='video' className="text-[10px] lg:text-[14px]">Video Management</NavLink>, '/video', <VideoSettingsIcon  className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to='footer' className="text-[10px] lg:text-[14px]">Footer Management</NavLink>, '/footer', <SettingsIcon  className='!text-[17px] !text-[#CD5C08]'/>),
    getItem(<NavLink to="scratchcard" className="text-[10px] lg:text-[14px]">Scratch Card</NavLink>, '/scratchcard',<CreditScoreIcon  className='!text-[17px] !text-[#CD5C08]'/>),
    // getItem(<NavLink to="printer" className="text-[10px] lg:text-[14px]">Printer</NavLink>, '/printer',<CreditScoreIcon  className='!text-[17px] !text-[#CD5C08]'/>),

    
    
    
    getItem(<div className='text-[10px] lg:text-[14px]'>Support</div>, 'sub3', <SupportAgentIcon className='!text-[17px] !text-[#CD5C08]' />, [
      getItem(<a href="tel:+9150289762" className="text-[10px] lg:text-[14px]">Call</a>, '/call'),
      getItem(<a href="https://wa.me/9150289762" className="text-[10px] lg:text-[14px]">Whatsapp</a>, '/whatsapp'),
      getItem(<a href="mailto:mag@bromagindia.com" className="text-[10px] lg:text-[14px]">Email</a>, '/email'),
    ]),
  ];