import React from 'react';
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Outlet, Link } from 'react-router-dom';
import { AdjustmentsVerticalOutline, Cog8ToothOutline, HomeModernOutline, ListBulletOutline, MagnifyingGlassOutline, UserOutline } from './components/icons';
import { classNames } from './utils';

const navigation = [
  { name: "Home", href: "/", icon: HomeModernOutline, current: true },
  { name: "Search", href: "/search", icon: MagnifyingGlassOutline, current: false },
  { name: "Library", href: "/library", icon: ListBulletOutline, current: false },
];
const teams = [
  {
    id: 1,
    name: "Settings",
    href: "/settings",
    icon: Cog8ToothOutline,
    current: false,
  },
  {
    id: 2,
    name: "Volume",
    href: "/volume",
    icon: AdjustmentsVerticalOutline,
    current: false,
  },
  { id: 3, name: "Profile", href: "/profile", icon: UserOutline, current: false },
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-black">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-grey-800/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="/images/orchestrionix-logo-white.png"
                        alt="Orchestrionix"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-2">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link 
                                  to={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gold text-white"
                                      : "text-white hover:text-white hover:bg-gold",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-white"
                                        : "text-white group-hover:text-white",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link >
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-white">
                            Configuration
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-2">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <Link 
                                  to={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-gold text-white"
                                      : "text-white hover:text-white hover:bg-gold",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <team.icon
                                    className={classNames(
                                      team.current
                                        ? "text-white"
                                        : "text-white group-hover:text-white",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />

                                  <span className="truncate">{team.name}</span>
                                </Link >
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like border-gold vertical devider*/}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto  bg-black px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="/images/orchestrionix-logo-white.png"
                alt="Orchestrionix"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-4">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link 
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gold text-white"
                              : "text-white hover:text-gold hover:bg-black",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-white"
                                : "text-white group-hover:text-gold",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link >
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-white">
                    Configuration
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-3">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <Link 
                          to={team.href}
                          className={classNames(
                            team.current
                              ? "bg-black text-gold"
                              : "text-white  hover:text-gold hover:bg-black",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <team.icon
                            className={classNames(
                              team.current
                                ? "text-gold"
                                : "text-white group-hover:text-gold",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{team.name}</span>
                        </Link >
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Sticky Div */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-black px-4 py-4 shadow-sm sm:px-6 lg:hidden h-16">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Orchestrionix
          </div>
          {/* <a href="#">
            <span className="sr-only">Your profile</span>
            <span>img</span>
          </a> */}
        </div>
        {/* Main Content */}
        <main className="lg:ml-72 p-1 pt-4 sm:p-5  bg-grey-900 lg:h-screen h-[calc(100vh-4rem)] overflow-hidden grid grid-rows-[1fr_auto]">
          {/* Children Container: Occupies remaining space and scrolls if content overflows */}
          <div className="sm:bg-black rounded-3xl sm:px-8 xs:pb-4 xs:pt-1 sm:pt-4 overflow-auto">
            {<Outlet />}
          </div>
          {/* Player Control: Fixed height, ensured by grid layout */}
          <div className="bg-black h-40 xl:h-28 rounded-3xl mt-5 mb-3">
            
          </div>
        </main>


      </div>
    </>
  );
};

export default Layout;
