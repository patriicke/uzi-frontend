import {
  faEnvelope,
  faGear,
  faHouse,
  faTrash,
  faUser,
  faUserGroup,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICONS } from "../../../../assets";

export type ISideBarLinksType = {
  name: string;
  icon: IconDefinition;
  href: string;
};

export const SideBarLinks: ISideBarLinksType[] = [
  {
    name: "Dashboard",
    icon: faHouse,
    href: "/admin"
  },
  {
    name: "Users",
    icon: faUser,
    href: "/admin/users"
  },
  {
    name: "Rooms",
    icon: faUserGroup,
    href: "/admin/rooms"
  },
  {
    name: "Messages",
    icon: faEnvelope,
    href: "/admin/messages"
  }
];

const SideBarComponent: React.FC = () => {
  const [currentLink, setCurrentLink] = useState<number>(0);

  useEffect(() => {
    SideBarLinks.map(({ href }, index) => {
      if (window.location.href.includes(href.toLowerCase()))
        setCurrentLink(index);
    });
  }, [window.location.href]);

  return (
    <div className='c f g s qa sa db pb ac gc mc bd tf wf zg vb'>
      <div>
        <div className='qa dc ud'>
          <div className='z ta db qb nc'>
            <img
              src={ICONS.PersonIcon}
              alt='profile'
              className='ua db nc sd td'
            />
          </div>
          <div>
            <p className='bf ef'>Hello 👋</p>
            <h6 className='xe bf ef'>NDAYAMBAJE</h6>
          </div>
        </div>
        <div className='_ ud he'>
          <form className='e'>
            <input
              type='text'
              placeholder='Search here...'
              className='va db oc tc xc ad ie je ye bf ff mf vf eg'
            />
            <button className='d h/2 i xb/2'>
              <svg
                width={18}
                height={18}
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z'
                  fill='#637381'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M11.958 11.958C12.2508 11.6651 12.7257 11.6651 13.0186 11.958L16.2811 15.2205C16.574 15.5133 16.574 15.9882 16.2811 16.2811C15.9882 16.574 15.5133 16.574 15.2205 16.2811L11.958 13.0186C11.6651 12.7257 11.6651 12.2508 11.958 11.958Z'
                  fill='#637381'
                />
              </svg>
            </button>
          </form>
        </div>
        <div className='yd'>
          <nav>
            <ul className='flex gap-3 flex-col'>
              {SideBarLinks.map(({ href, icon, name }, index) => {
                return (
                  <li
                    onClick={() => {
                      setCurrentLink(index);
                    }}
                    key={index}
                  >
                    {currentLink === index ? (
                      <Link
                        to={href}
                        className='e aa qa dc oc zd yd xe bf ef wf xf bg bg-primary-500 text-white hover:bg-primary-500'
                      >
                        <span className='ke'>
                          <FontAwesomeIcon icon={icon} className='text-lg' />
                        </span>
                        {name}
                      </Link>
                    ) : (
                      <Link
                        to={href}
                        className='e aa qa dc oc zd yd xe bf ef wf xf bg hover:bg-primary-500'
                      >
                        <span className='ke'>
                          <FontAwesomeIcon icon={icon} className='text-lg' />
                        </span>
                        {name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      <div className='w da wc xc le'>
        <div className='qa xa db dc hc pc ad'>
          <Link to='#' className='ef cg'>
            <FontAwesomeIcon icon={faGear} />
          </Link>
          <Link to='#' className='ef cg'>
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <Link to='#' className='ef cg'>
            <FontAwesomeIcon icon={faTrash} />
          </Link>
        </div>
        <div className='qa dc hc le'>
          <Link to='#' className='ye bf ef cg'>
            Privacy
          </Link>
          <Link to='#' className='ye bf ef cg'>
            Terms
          </Link>
          <button className='ye bf ef cg'>Log out</button>
        </div>
      </div>
    </div>
  );
};

export default SideBarComponent;
