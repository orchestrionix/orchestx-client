import { HomeIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';


export type BreadcrumbProp = {
  name: string;
  href: string;
  current?: boolean;
};

type Props = {
  items: BreadcrumbProp[];
  home: BreadcrumbProp;
};

const Breadcrumb: React.FC<Props> = ({ items, home }) => {
  return (
    <nav className='flex' aria-label='Breadcrumb'>
      <ol className='flex items-center space-x-4'>
        {home && (
          <li className='flex'>
            <div className='flex items-center'>
              <a
                href={home.href}
                className='text-sm font-medium text-gray-400 hover:text-primary transition-colors'
              >
                <HomeIcon
                  className='h-5 w-5 flex-shrink-0'
                  aria-hidden='true'
                />
                <span className='sr-only'>{home.name}</span>
              </a>
            </div>
          </li>
        )}
        {items.map(page => (
          <li key={page.name} className='flex'>
            <div className='flex items-center'>
              <ChevronRightIcon
                className='h-5 w-5 flex-shrink-0 text-gray-400'
                aria-hidden='true'
              />
              <a
                href={page.href}
                className={`ml-4 text-sm font-medium capitalize transition-colors ${
                  page.current 
                    ? 'text-primary' 
                    : 'text-gray-400 hover:text-primary'
                }`}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;