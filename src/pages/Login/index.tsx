import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Background from '@/components/common/Background';
import { authService } from '@/services/auth';
import { storage } from '@/utils/storage';
import Yun from '@/assets/images/login/yun.png';
import Sun from '@/assets/images/login/sun.png';
import LoginGoogle from '@/assets/images/login/login-google.png';
import Twitter from '@/assets/icons/Twitter.png';
import Website from '@/assets/icons/Website.png';
import DexScreener from '@/assets/icons/DexScreener.png';
import GuestLogin from '@/assets/images/login/guest-login.png';
import { useUserStore } from '@/stores/useUserStore';

import './index.less';

const HOST_URL = import.meta.env.VITE_API_HOST_URL;

export default function Login() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { logout,userProfile } = useUserStore();
  //const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    window.open(`${HOST_URL}/#/popup-login`, 'popup', 'width=600,height=600,status=yes,scrollbars=yes');
  };

  useEffect(() => {
    const clear = searchParams.get('clear');
    if (clear) {
      logout();
      // 使用 navigate 来更新 URL
      navigate(window.location.pathname, { replace: true });
      return;
    }
    const handleAuthMessage = async (event: MessageEvent) => {
      console.warn('handleAuthMessage', event);

      const { type, data } = event.data;

      if (type === 'GOOGLE_AUTH_SUCCESS' && data) {
        const { token, id = 'guest', google } = data;
        const gmail = google?.email || 'gmail';

        if (token) {
          storage.setToken(token);
          //console.warn('login', id, gmail);
          await authService.login(id, gmail);
          //console.warn('login success');
          navigate('/egg-select');
        }
      }
    };

    const userId = localStorage.getItem('userId')
    if (userProfile && userProfile.gmail && userId) {
      navigate('/plugin/chat'); // already login
      return;
    }

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  function simpleHash(input: string) {
    let hash = 0;
    if (input.length === 0) return hash;

    for (let i = 0; i < input.length; i++) {
      let char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    return hash.toString();
  }

  function generateGuestName() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return 'Guest-' + timestamp + randomNum;
  }

  function generateGuestPassword(name: string) {
    return simpleHash(name).toString();
  }

  const handleGuestAuth = async () => {
    const userId = localStorage.getItem('userId');
    const userProfile = localStorage.getItem('userProfile');
    const twitterProfile = localStorage.getItem('twitterProfile');
    console.log('Guest info: ' + userId + ' ' + userProfile?.toString().length + ' ' + twitterProfile?.toString().length);

    if (userId && userProfile) {
      navigate('/plugin/chat'); // already login
      return;
    }
    try {
      // Guest
      const username = generateGuestName();
      const password = generateGuestPassword(username);
      const email = '';
      const credentials = { username, password, email };
      const response = await authService.guestLogin(credentials);
      console.log('guest auth, res: ' + response);
      // Navigate to next page
      navigate('/egg-select');
    } catch (err) {
      console.error('Guest auth error:', err);
      setError(err instanceof Error ? err.message : 'Guest authentication failed');
      console.log(error);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <div className="page press-start-2p">
    <div className="absolute top-0 left-0 z-[-1] w-full h-full bg-white">
      <Background />
    </div>
    <div className="m-x-auto max-w-[450px] relative w-full h-[161px]">
      <img src={Yun} className="absolute top-[10%] left-[5%] w-[98px] h-[98px]" />
      <img src={Yun} className="absolute top-[50px] right-[80px] w-[98px] h-[98px]" />
      <img src={Sun} className="absolute top-0 right-0 w-[89px] h-[89px]" />
    </div>
    <div className="text-center w-auto mt-[33px] mb-[50px]">
      <h1 className="press-start-2p font-size-5 text-xl">CREATE YOUR OWN</h1>
      <h1 className="press-start-2p font-size-5 text-xl">SOCIAL AGENT</h1>
    </div>
    {/* <div className="m-x-auto w-[298px] relative">
      <img src={LoginGoogle} className="w-[298px]" />
      <div className="h-[48px] w-full absolute top-0" onClick={handleAuth}></div>
      <div className="h-[25px] w-[120px] absolute bottom-0 left-[50%] ml-[-60px]" onClick={handleGuestAuth}></div>
    </div> */}
    <img src={LoginGoogle} className="w-[298px] btn-scale" onClick={handleAuth} />
    <div className="text-center mt-[30px] Geologica text-[15px] color-[#b9b9b9] mr-[10px]">or</div>
    <img className="w-[90px] mt-[29px] btn-scale" src={GuestLogin} onClick={handleGuestAuth}></img>
    <div className="hosting-content-popup-main-footer">
      <div
        className="hosting-content-popup-main-footer-item btn-scale"
        onClick={() => {
          window.location.href = 'https://halagent.org/';
        }}
      >
        <img className="hosting-content-popup-main-footer-item-icon" src={Website}></img>
        <div className="hosting-content-popup-main-footer-item-text">Website</div>
      </div>
      <div
        className="hosting-content-popup-main-footer-item btn-scale"
        onClick={() => {
          window.location.href = 'https://x.com/HALAI_SOL';
        }}
      >
        <img className="hosting-content-popup-main-footer-item-icon" src={Twitter}></img>
        <div className="hosting-content-popup-main-footer-item-text">Twitter</div>
      </div>
      <div
        className="hosting-content-popup-main-footer-item btn-scale"
        onClick={() => {
          window.location.href = 'https://dexscreener.com/solana/6pcybkvfmopvbtsfy8fqatzolqq5s325b6st2sf7yzbw';
        }}
      >
        <img className="hosting-content-popup-main-footer-item-icon" src={DexScreener}></img>
        <div className="hosting-content-popup-main-footer-item-text">DexScreener</div>
      </div>
    </div>
  </div>
  );
}
