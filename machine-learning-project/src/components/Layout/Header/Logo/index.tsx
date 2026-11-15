import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {

    return (
        <div className="relative -top-1.89">
        <Link href="/">
            <Image
                src="/images/logo/logo_light.png"
                alt="logo"
                width={160}
                height={50}
                style={{ width: 'auto', height: 'auto' }}
                quality={100}
                className='dark:hidden'
            />
            <Image
                src="/images/logo/logo.png"
                alt="logo"
                width={160}
                height={50}
                style={{ width: 'auto', height: 'auto' }}
                quality={100}
                className='dark:block hidden'
            />
        </Link>
        </div>
    );
};

export default Logo;
