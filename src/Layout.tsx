import React, { useContext, useEffect } from 'react';
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ComputerDesktopIcon,
  XMarkIcon,
  ArrowPathIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import {
  ComputerDesktopIcon as ComputerDesktopIconSolid,
} from "@heroicons/react/24/solid";
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  AdjustmentsVerticalOutline, 
  Cog8ToothOutline, 
  HomeModernOutline, 
  ListBulletOutline, 
  MagnifyingGlassOutline,
  HomeModernSolid,
  ListBulletSolid,
  MagnifyingGlassSolid,
  Cog8ToothSolid,
  AdjustmentsVerticalSolid,
} from './components/icons';
import { classNames } from './utils';
import PlayerControle from './components/player';
import { PlayerContext } from './playerProvider';

// Define types for navigation items
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface TeamItem extends NavigationItem {
  id: number;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/", icon: HomeModernOutline, iconSolid: HomeModernSolid },
  { name: "Search", href: "search", icon: MagnifyingGlassOutline, iconSolid: MagnifyingGlassSolid },
  { name: "Library", href: "library", icon: ListBulletOutline, iconSolid: ListBulletSolid },
];

const teams: TeamItem[] = [
  {
    id: 1,
    name: "Settings",
    href: "/settings",
    icon: Cog8ToothOutline,
    iconSolid: Cog8ToothSolid,
  },
  {
    id: 3,
    name: "Views",
    href: "/views",
    icon: ComputerDesktopIcon,
    iconSolid: ComputerDesktopIconSolid,
  },
  {
    id: 2,
    name: "Volume",
    href: "/volume",
    icon: AdjustmentsVerticalOutline,
    iconSolid: AdjustmentsVerticalSolid,
  },
];

const Layout = () => {
  const context = useContext(PlayerContext);
  const playerState = context?.playerState;
  const connectionError = context?.connectionError;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [showOverlay, setShowOverlay] = useState(false);

  // Show overlay when connection is lost or player has error
  useEffect(() => {
    if (playerState?.status === "error" || connectionError) {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  }, [playerState?.status, connectionError]);


  // Function to check if a navigation item is currently active
  const isActive = (path: string): boolean => {
    // Remove leading slash if present for consistent comparison
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

    if (normalizedPath === '') {
      // Special case for home route
      return location.pathname === '/';
    }

    // Use exact path matching for proper highlighting
    return location.pathname === '/' + normalizedPath;
  };

  return (
    <>
      {/* Error Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-md bg-black/40 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-white/[0.07] to-black/30 rounded-3xl backdrop-blur-xl border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* Glass reflections */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* Background glow effects */}
            <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gold/[0.08] rounded-full blur-3xl" />
            <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-red-500/[0.08] rounded-full blur-3xl" />

            {/* Content container */}
            <div className="relative px-6 py-8 sm:px-8 sm:py-10">
              {/* Large icon at the top */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl transform scale-150" />
                  <div className="relative bg-gradient-to-b from-red-500/10 via-red-500/5 to-transparent rounded-full p-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-full" />
                    <MusicalNoteIcon className="h-14 w-14 sm:h-20 sm:w-20 text-red-500/90" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="text-center space-y-3 relative">
                <h3 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                  Player Connection Lost
                </h3>
                <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Please refresh the page to restore playback functionality.
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold/90 to-gold/80 rounded-2xl text-black font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-100 group"
                >
                  <ArrowPathIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" aria-hidden="true" />
                  Refresh Player
                </button>

                {/* Dismiss Button commented out for now */}
                {/* <button
                  onClick={() => setShowOverlay(false)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/[0.05] hover:bg-white/[0.08] rounded-2xl text-white/70 font-medium transition-all duration-200 border border-white/[0.05] hover:border-white/[0.08]"
                >
                  Dismiss
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-black">
        <body class="h-full">
        ```
      */}
      <div>
        {/* Mobile Bottom Sheet Navigation */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            {/* Backdrop with blur */}
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            </Transition.Child>

            {/* Bottom Sheet Container */}
            <div className="fixed inset-0 flex items-end justify-center">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-300 transform"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in duration-200 transform"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="w-full max-w-lg">
                  {/* Glass Card */}
                  <div className="relative bg-gradient-to-b from-grey-700/95 to-grey-900/98 backdrop-blur-xl rounded-t-3xl border-t border-x border-white/[0.08] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                    {/* Top edge highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    
                    {/* Drag Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                      <div className="w-10 h-1 rounded-full bg-white/20" />
                    </div>
                    
                    {/* Header */}
                    <div className="px-6 pb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* <img
                          className="h-7 w-auto"
                          src="/images/orchestrionix-logo-white.png"
                          alt="Orchestrionix"
                        /> */}
                        
                        <span className="text-white/60 text-sm font-medium">Menu</span>
                      </div>
                      <button
                        type="button"
                        className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <XMarkIcon className="h-5 w-5 text-white/60" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Navigation Content */}
                    <nav className="px-4 pb-8 max-h-[70vh] overflow-y-auto">
                      {/* Main Navigation */}
                      <div className="space-y-1">
                        {navigation.map((item, idx) => {
                          const active = isActive(item.href);
                          const IconComponent = active ? item.iconSolid : item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                active
                                  ? "bg-gold/20 border-gold/40"
                                  : "bg-transparent border-transparent hover:bg-white/5 active:bg-white/10",
                                "group flex items-center gap-4 rounded-2xl px-4 py-4 border transition-all duration-200"
                              )}
                              style={{ 
                                animationDelay: `${idx * 50}ms`,
                                animation: sidebarOpen ? 'fadeSlideUp 0.3s ease-out forwards' : 'none'
                              }}
                            >
                              <div className={classNames(
                                active 
                                  ? "bg-gold text-black" 
                                  : "bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/15",
                                "flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200"
                              )}>
                                <IconComponent className="h-5 w-5" aria-hidden="true" />
                              </div>
                              <span className={classNames(
                                active ? "text-gold" : "text-white/80 group-hover:text-white",
                                "text-base font-medium transition-colors"
                              )}>
                                {item.name}
                              </span>
                              {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Divider */}
                      <div className="my-5 mx-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                      {/* Configuration Section */}
                      <div className="mb-3 px-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                          Configuration
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {teams.map((team, idx) => {
                          const active = isActive(team.href);
                          const IconComponent = active ? team.iconSolid : team.icon;
                          return (
                            <Link
                              key={team.name}
                              to={team.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                active
                                  ? "bg-gold/20 border-gold/40"
                                  : "bg-transparent border-transparent hover:bg-white/5 active:bg-white/10",
                                "group flex items-center gap-4 rounded-2xl px-4 py-4 border transition-all duration-200"
                              )}
                              style={{ 
                                animationDelay: `${(navigation.length + idx) * 50}ms`,
                                animation: sidebarOpen ? 'fadeSlideUp 0.3s ease-out forwards' : 'none'
                              }}
                            >
                              <div className={classNames(
                                active 
                                  ? "bg-gold text-black" 
                                  : "bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/15",
                                "flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200"
                              )}>
                                <IconComponent className="h-5 w-5" aria-hidden="true" />
                              </div>
                              <span className={classNames(
                                active ? "text-gold" : "text-white/80 group-hover:text-white",
                                "text-base font-medium transition-colors"
                              )}>
                                {team.name}
                              </span>
                              {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                      
                      {/* Safe area for home indicator */}
                      <div className="h-4" />
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
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-4">
                    {navigation.map((item) => {
                      const active = isActive(item.href);
                      const IconComponent = active ? item.iconSolid : item.icon;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={classNames(
                              active
                                ? "bg-gold text-white"
                                : "text-white hover:text-gold hover:bg-black",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <IconComponent
                              className={classNames(
                                active
                                  ? "text-white"
                                  : "text-white group-hover:text-gold",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link >
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-white">
                    Configuration
                  </div>
                  <ul className="-mx-2 mt-2 space-y-3">
                    {teams.map((team) => {
                      const active = isActive(team.href);
                      const IconComponent = active ? team.iconSolid : team.icon;
                      return (
                        <li key={team.name}>
                          <Link
                            to={team.href}
                            className={classNames(
                              active
                                ? "bg-gold text-white"
                                : "text-white  hover:text-gold hover:bg-black",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <IconComponent
                              className={classNames(
                                active
                                  ? "text-white"
                                  : "text-white group-hover:text-gold",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            <span className="truncate">{team.name}</span>
                          </Link >
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-40 flex items-center justify-between bg-black/95 backdrop-blur-sm px-4 py-3 border-b border-white/[0.05] lg:hidden h-14">
          <div className="flex items-center gap-3">
            <img
              className="h-6 w-auto"
              src="/images/orchestrionix-logo-white.png"
              alt="Orchestrionix"
            />
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-5 w-5 text-white/80" aria-hidden="true" />
          </button>
        </div>
        {/* Main Content */}
        <main className="lg:ml-72 p-1 pt-4 sm:p-5 bg-grey-900 lg:h-screen h-[calc(100vh-3.5rem)] overflow-hidden grid grid-rows-[1fr_auto]">
          {/* Children Container: Occupies remaining space and scrolls if content overflows */}
          <div className="sm:bg-black rounded-3xl sm:px-8 xs:pb-4 xs:pt-1 sm:pt-4 overflow-auto">
            {<Outlet />}
          </div>
          {/* Player Control: Fixed height, ensured by grid layout */}
          <div className="bg-black h-40 xl:h-28 rounded-3xl mt-5 mb-3">
            <PlayerControle />
          </div>
        </main>


      </div>
    </>
  );
};

export default Layout;
