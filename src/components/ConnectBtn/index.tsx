import { useUserStore } from '@/stores/useUserStore';
import PixModal from '../common/PixModal';
import ShortButton from '@/pages/Chat/components/ShortButton';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import walletIcon from '@/assets/icons/wallet.svg';
import { useConnectWallet } from '@privy-io/react-auth';
import { isWeb } from '@/utils/config';
import './index.less';
import { authService } from '@/services/auth';
import { useWallet } from '@suiet/wallet-kit';

const HOST_URL = import.meta.env.VITE_API_HOST_URL;

const ConnectBtn = () => {
  const wallet = useWallet();
  const suiWallet = wallet;
  const { userProfile, wallet: allWallet, setWallet } = useUserStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connectWallet } = useConnectWallet({
    onSuccess: params => {
      console.log('onSuccess', params);
      setWallet(params.wallet);
      const latestUserProfile = useUserStore.getState().userProfile;
      if (latestUserProfile) {
        authService.updateProfile(latestUserProfile.userId, {
          ...latestUserProfile,
          walletChainType: params.wallet.type.substring(0, 3),
          walletAddress: params.wallet.address,
        });
      }
    },
    onError: () => {
      console.log('onError');
    },
  });

  const handleWalletConnect = async () => {
    if (allWallet?.address) {
      return;
    }
    if (isWeb()) {
      if (userProfile?.userId) {
        if (suiWallet) {
          try {
            suiWallet.select('Suiet');
          }
          catch (err) {
            try {
              suiWallet.select('Sui Wallet');
            }
            catch (err1) {
              console.log(err1);
            }
          }
          //console.log(suiWallet);
          //console.log(suiWallet.address);
          const address = suiWallet.account?.address || suiWallet.address;
          const latestUserProfile = useUserStore.getState().userProfile;
          if (latestUserProfile) {
            authService.updateProfile(latestUserProfile.userId, {
              ...latestUserProfile,
              walletChainType: 'sui',
              walletAddress: address,
            });
          }
        }
        else {
          connectWallet();
        }
      } else {
        setIsModalOpen(true);
      }
    } else {
      if (userProfile?.gmail) {
        window.open(`${HOST_URL}/#/popup-wallet`, 'popup', 'width=600,height=600,status=yes,scrollbars=yes');
      } else {
        // Popup tips
        //localStorage.clear();
        setIsModalOpen(true);
      }
    }
  };

  const disconnectWallet = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (suiWallet) {
        try {
          suiWallet.disconnect();
        }
        catch (err) {
        }
        return;
      }
      allWallet?.disconnect?.();
      setWallet(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const closeModal = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsModalOpen(false);
  };

  // // Message from parent
  // const handleWalletMessage = async (event: MessageEvent) => {
  //   //console.warn('handleWalletMessage', event);
  //   const { type, data } = event.data;

  //   // LINK_WALLET_SUCCESS
  //   if (type === 'LINK_WALLET_SUCCESS' && data) {
  //     await updateWalletAddress(data);
  //   }

  //   //if (user && user.wallet && user.wallet.address) {
  //   //  await updateWalletAddress(user.wallet.address);
  //   //}
  // };

  // useEffect(() => {
  //   // Listen the message from parent
  //   window.addEventListener('message', handleWalletMessage);

  //   // clean message listener
  //   return () => {
  //     window.removeEventListener('message', handleWalletMessage);
  //   };
  // }, [user, userProfile]);
  return (
    <>
      <PixModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col gap-4 max-w-[400px] Gantari">
          <h2 className="text-center my-0">Login Tips</h2>
          <h3 className="text-center my-10">Please login firstly before connect wallet.</h3>
          <div className="flex justify-center gap-4">
            <ShortButton
              onClick={() => {
                navigate('/login');
              }}
              className="text-black text-center"
            >
              Login
            </ShortButton>
            <ShortButton onClick={closeModal} className="text-black text-center">
              Cancel
            </ShortButton>
          </div>
        </div>
      </PixModal>
      <div
        className={`${
          suiWallet?.address ? 'connect-btn-active' : ''
        } connect-btn ml-[10px]  w-[130px] flex items-center justify-around gap-2 box-border border-black border-solid rounded-xl px-4 py-2 Gantari bg-white`}
        onClick={handleWalletConnect}
      >
        <img src={walletIcon} alt="wallet" className="w-[20px] h-[20px] object-contain link-cursor" />
        {suiWallet?.address ? (
          <span className="capitalize text-black text-xs Geologica flex-1 text-center">
            {suiWallet.address.substring(0, 4) + '...' + suiWallet.address.substring(suiWallet.address.length - 4, suiWallet.address.length)}
          </span>
        ) : (
          <span className="capitalize text-black text-xs Geologica flex-1 text-center">connect</span>
        )}
        <div
          className="connect-btn-child flex items-center justify-around box-border border-black border-solid rounded-xl px-4 py-2 Gantari"
          onClick={disconnectWallet}
        >
          Disconnect
        </div>
      </div>
    </>
  );
};

export default ConnectBtn;
