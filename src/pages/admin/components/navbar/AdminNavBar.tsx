import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICONS } from "../../../../assets";
import { ISideBarContext, SidebarContext } from "../../../../context/sidebar";
import { SideBarLinks } from "../sidebar/MobileNavBar";

const ForwardArrow = () => {
  return (
    <svg width={7} height={12} viewBox='0 0 7 12' className='fill-current'>
      <path d='M0.879233 11.4351C0.808625 11.4351 0.720364 11.3998 0.667408 11.3469C0.543844 11.2233 0.543844 11.0291 0.649756 10.9056L5.09807 6.17483C5.18633 6.08657 5.18633 5.92771 5.09807 5.82179L0.649756 1.09105C0.526192 0.967487 0.543844 0.773315 0.667408 0.649751C0.790972 0.526187 0.985145 0.543839 1.10871 0.667403L5.55702 5.39815C5.85711 5.73353 5.85711 6.26309 5.55702 6.58083L1.10871 11.3292C1.0381 11.3998 0.967493 11.4351 0.879233 11.4351Z' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.229332 10.5281L4.48868 5.99831L0.24288 1.48294C-0.133119 1.09849 -0.0312785 0.549591 0.267983 0.25033C0.652758 -0.134445 1.2069 -0.0332381 1.50812 0.267982L1.52041 0.280272L5.9781 5.02138C6.46442 5.56491 6.47872 6.42661 5.96853 6.96778V6.96778L1.50834 11.7289C1.36051 11.8767 1.15353 12 0.879227 12C0.660517 12 0.428074 11.9064 0.267983 11.7463C-0.0719543 11.4064 -0.0699959 10.8773 0.220873 10.538L0.229332 10.5281ZM5.55702 6.58083C5.85711 6.26309 5.85711 5.73353 5.55702 5.39815L1.10871 0.667403C0.985145 0.543839 0.790972 0.526187 0.667408 0.649751C0.543844 0.773315 0.526192 0.967487 0.649756 1.09105L5.09807 5.82179C5.18633 5.92771 5.18633 6.08657 5.09807 6.17483L0.649756 10.9056C0.543844 11.0291 0.543844 11.2233 0.667408 11.3469C0.720364 11.3998 0.808625 11.4351 0.879233 11.4351C0.967493 11.4351 1.0381 11.3998 1.10871 11.3292L5.55702 6.58083Z'
      />
    </svg>
  );
};

const AdminNavBar = () => {
  const { toggleSidebar } = useContext<ISideBarContext>(SidebarContext);

  const [currentLink, setCurrentLink] = useState<number>(0);

  useEffect(() => {
    SideBarLinks.map(({ href }, index) => {
      if (window.location.href.includes(href.toLowerCase()))
        setCurrentLink(index);
    });
  }, [window.location.href]);

  return (
    <header className='db bg-primary-500 h-20'>
      <div className='e x db me sg ch h-full'>
        <button
          className='d j h/2 qa ya fb xb/2 dc fc oc gf hover:border hover:bg-slate-400 duration-200 xl:hidden'
          onClick={() => {
            toggleSidebar();
          }}
        >
          <svg
            width={25}
            height={25}
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M1.45833 10.0007C1.45833 9.42535 1.9247 8.95898 2.49999 8.95898H17.5C18.0753 8.95898 18.5417 9.42535 18.5417 10.0007C18.5417 10.5759 18.0753 11.0423 17.5 11.0423H2.49999C1.9247 11.0423 1.45833 10.5759 1.45833 10.0007Z'
              fill='white'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M1.45833 5.00065C1.45833 4.42535 1.9247 3.95898 2.49999 3.95898H17.5C18.0753 3.95898 18.5417 4.42535 18.5417 5.00065C18.5417 5.57595 18.0753 6.04232 17.5 6.04232H2.49999C1.9247 6.04232 1.45833 5.57595 1.45833 5.00065Z'
              fill='white'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M1.45833 15.0007C1.45833 14.4254 1.9247 13.959 2.49999 13.959H17.5C18.0753 13.959 18.5417 14.4254 18.5417 15.0007C18.5417 15.5759 18.0753 16.0423 17.5 16.0423H2.49999C1.9247 16.0423 1.45833 15.5759 1.45833 15.0007Z'
              fill='white'
            />
          </svg>
        </button>
        <div className='qa dc gc yd ah h-full'>
          <div className='qa db dc gc'>
            <div className='z qa dc'>
              <ul className='flex items-center'>
                <li className='flex items-center'>
                  <span className='flex items-center text-base font-semibold text-white hover:text-opacity-80'>
                    <span className='pr-2'>
                      <FontAwesomeIcon icon={faHouse} />
                    </span>
                  </span>
                  <span className='px-3 text-white'>
                    <ForwardArrow />
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='text-base font-semibold text-white hover:text-opacity-80'>
                    Admin
                  </span>
                  <span className='px-3 text-white'>
                    <ForwardArrow />
                  </span>
                </li>
                {SideBarLinks.map(({ name }, index) => {
                  return (
                    <li
                      className='text-base font-semibold text-white text-opacity-80'
                      key={index}
                    >
                      {currentLink === index && name}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <div className='qa dc ec'>
                <div className='e z ra ng'>
                  <span className='e oa'>
                    <span className='d m n oa nc fd ce _e bf gf'>3</span>
                    <svg
                      width={20}
                      height={20}
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M5.87524 2.54253C6.9692 1.44857 8.45293 0.833984 10 0.833984C11.5471 0.833984 13.0309 1.44857 14.1248 2.54253C15.2188 3.63649 15.8334 5.12022 15.8334 6.66732C15.8334 9.4612 16.4309 11.1962 16.9816 12.2058C17.2581 12.7127 17.5273 13.0452 17.7144 13.2426C17.8081 13.3416 17.8817 13.4072 17.9261 13.4441C17.9483 13.4626 17.9632 13.474 17.9696 13.4787C17.9706 13.4795 17.9714 13.4801 17.9719 13.4805C18.2707 13.6857 18.4029 14.0611 18.2976 14.4088C18.1912 14.7603 17.8672 15.0007 17.5 15.0007H2.50002C2.1328 15.0007 1.80886 14.7603 1.70245 14.4088C1.59716 14.0611 1.72936 13.6857 2.0281 13.4805C2.02868 13.4801 2.02948 13.4795 2.03048 13.4787C2.0369 13.474 2.05177 13.4626 2.07396 13.4441C2.11831 13.4072 2.19196 13.3416 2.28569 13.2426C2.47271 13.0452 2.74195 12.7127 3.01844 12.2058C3.56913 11.1962 4.16669 9.4612 4.16669 6.66732C4.16669 5.12022 4.78127 3.63649 5.87524 2.54253ZM2.03652 13.4748C2.03659 13.4747 2.03665 13.4747 2.03672 13.4746C2.03672 13.4746 2.03671 13.4747 2.03671 13.4747L2.03652 13.4748ZM4.29113 13.334H15.7089C15.6455 13.2301 15.5819 13.1201 15.5184 13.0039C14.8191 11.7218 14.1667 9.70677 14.1667 6.66732C14.1667 5.56225 13.7277 4.50244 12.9463 3.72104C12.1649 2.93964 11.1051 2.50065 10 2.50065C8.89496 2.50065 7.83515 2.93964 7.05375 3.72104C6.27234 4.50244 5.83336 5.56225 5.83336 6.66732C5.83336 9.70677 5.18091 11.7218 4.4816 13.0039C4.41819 13.1201 4.35453 13.2301 4.29113 13.334Z'
                        fill='white'
                      />
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M8.14018 16.7787C8.53829 16.5477 9.04822 16.6832 9.27916 17.0813C9.35241 17.2076 9.45756 17.3124 9.58406 17.3853C9.71057 17.4582 9.854 17.4965 9.99999 17.4965C10.146 17.4965 10.2894 17.4582 10.4159 17.3853C10.5424 17.3124 10.6476 17.2076 10.7208 17.0813C10.9518 16.6832 11.4617 16.5477 11.8598 16.7787C12.2579 17.0096 12.3934 17.5195 12.1625 17.9176C11.9427 18.2965 11.6273 18.6109 11.2478 18.8295C10.8683 19.0481 10.438 19.1632 9.99999 19.1632C9.56202 19.1632 9.13173 19.0481 8.75221 18.8295C8.37269 18.6109 8.05725 18.2965 7.83749 17.9176C7.60656 17.5195 7.74208 17.0096 8.14018 16.7787Z'
                        fill='white'
                      />
                    </svg>
                  </span>
                </div>
                <div className='gg e'>
                  <div className='qa zb dc'>
                    <img
                      src={ICONS.PersonIcon}
                      alt='avatar'
                      className='_a ib nc vc yc _c sd td'
                    />
                    <span className='pe qe ye bf gf'>Patrick</span>
                    <span>
                      <svg
                        width={14}
                        height={14}
                        viewBox='0 0 14 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M3.08754 4.83687C3.31535 4.60906 3.68469 4.60906 3.9125 4.83687L7.00002 7.92439L10.0875 4.83687C10.3154 4.60906 10.6847 4.60906 10.9125 4.83687C11.1403 5.06468 11.1403 5.43402 10.9125 5.66183L7.4125 9.16183C7.1847 9.38963 6.81535 9.38963 6.58754 9.16183L3.08754 5.66183C2.85974 5.43402 2.85974 5.06468 3.08754 4.83687Z'
                          fill='white'
                        />
                      </svg>
                    </span>
                  </div>
                  <div className='b d o l ha jb jc oc bd vd qf uf wf hg ig jg'>
                    <Link to='#' className='oa oc yd de ye bf ef zf cg'>
                      Account Settings
                    </Link>
                    <Link to='#' className='oa oc yd de ye bf ef zf cg'>
                      Dashboard
                    </Link>
                    <Link to='#' className='oa oc yd de ye bf ef zf cg'>
                      Sign Out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavBar;
