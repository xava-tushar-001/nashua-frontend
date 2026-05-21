import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineUsers } from "react-icons/hi2";
import { BsImageAlt } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { SiMinutemailer } from "react-icons/si";

/**
 * Sidebar navigation items: title, link, icon, optional end (exact path match for NavLink)
 */
export const sidebarMenu = [
  {
    title: "Home",
    link: "/",
    icon: HiOutlineHome,
    end: true,
  },
  {
    title: "Image",
    link: "/image",
    icon: BsImageAlt,
    end: true,
  },
  {
    title: "Users",
    link: "/users",
    icon: BsPeople,
    end: true,
  },
  {
    title: "Template",
    link: "/template",
    icon: SiMinutemailer,
    end: true,
  }

];