import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary-700 ml-2">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100">
              <BellIcon className="w-5 h-5" />
            </button>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 text-sm bg-gray-100 rounded-full p-1.5 hover:bg-gray-200">
                <UserCircleIcon className="w-8 h-8 text-gray-600" />
                <span className="hidden md:block text-gray-700">
                  {user?.fullName}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;