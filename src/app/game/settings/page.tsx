'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditor from '@/components/rich-text-editor';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { validateUser } from '@/utils/validateAdmin';

const GameSettingsPage = () => {
  const [loading, setLoading] = useState(false);
      const router = useRouter();
      useEffect(() => {
          const adminCheck = async () => {
              const data = await validateUser();
              // console.log('data', data);
              if (data) {
                  return data
              } else {
                  localStorage.removeItem("userData");
                  router.push('/');
              }
          }
  
          adminCheck();
      }, []);
  

  const [appInfo, setAppInfo] = useState({
    appWebsite: '',
    contactPhone: '',
    whatsapp: '',
    email: '',
    regBonus: '',
    refBonus: '',
    homeBannerImage1: '',
    homeBannerImage2: '',
    homeBannerImage3: '',
  });

  const [media, setMedia] = useState({
    logoUrl: '',
    bannerUrls: [] as string[],
  });

  const [post, setPost] = useState({
    gameRules: ``,
    depositDetails: ``,
    withdrawalDetails: ``,
    notice: ``,
  });

  const [gameSettings, setGameSettings] = useState({
    withdrawalType: '',
    withdrawalLimit: '',
    minimumWithdrawalAmount: '',
    minimumDepositAmount: '',
    maxSingleBidNum: '',
    maxSingleBidAmt: '',
    minSingleBidAmt: '',
    maxPattiBidNum: '',
    maxPattiBidAmt: '',
    minPattiBidAmt: '',
    maxJodiBidNum: '',
    maxJodiBidAmt: '',
    minJodiBidAmt: '',
  });

  const [logo, setLogo] = useState('');

  useEffect(() => {
    const getAppSettings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/admin/getAppSettings');
        const data = res.data[0];
        setAppInfo({
          appWebsite: data.appWebsite,
          contactPhone: data.contactNumber,
          whatsapp: data.whatsappNumber,
          email: data.contactEmail,
          regBonus: data.registrationBonus,
          refBonus: data.RefferalBonus,
          homeBannerImage1: data.homeBannerImage1,
          homeBannerImage2: data.homeBannerImage2,
          homeBannerImage3: data.homeBannerImage3,
        });
        setPost({
          gameRules: data.gameRules,
          depositDetails: data.depositDetails,
          withdrawalDetails: data.withdrawalDetails,
          notice: data.notice,
        });
        setLogo(data.logo);
      } catch (err) {
        toast.error('Failed to fetch app settings');
      } finally {
        setLoading(false);
      }
    };
    getAppSettings();
    toast.success('App settings fetched successfully!');
  }, []);

  useEffect(() => {
    const getGameSettings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/admin/getGameSettings');
        const data = res.data[0];
        setGameSettings({
          withdrawalType: data.withdrawal,
          withdrawalLimit: data.withdrawalLimit,
          minimumWithdrawalAmount: data.minimumWithdrawalAmount,
          minimumDepositAmount: data.minimumDepositAmount,
          maxSingleBidNum: data.maximumSingleBiddingNumber,
          maxSingleBidAmt: data.maximumSingleBiddingAmount,
          minSingleBidAmt: data.minimumSingleBiddingAmount,
          maxPattiBidNum: data.maximumPattiBiddingNumber,
          maxPattiBidAmt: data.maximumPattiBiddingAmount,
          minPattiBidAmt: data.minimumPattiBiddingAmount,
          maxJodiBidNum: data.maximumJodiBiddingNumber,
          maxJodiBidAmt: data.maximumJodiBiddingAmount,
          minJodiBidAmt: data.minimumJodiBiddingAmount,
        });
      } catch (err) {
        toast.error('Failed to fetch game settings');
      } finally {
        setLoading(false);
      }
    };
    getGameSettings();
    toast.success(' Game settings fetched successfully!');
  }, []);

  const handleAppChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAppInfo({ ...appInfo, [e.target.name]: e.target.value });

  const handleGameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setGameSettings({ ...gameSettings, [e.target.name]: e.target.value });

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);
    try {
      const urls = await Promise.all(Array.from(e.target.files).map(uploadImageToCloudinary));
      setMedia((prev) => ({ ...prev, bannerUrls: urls }));
      toast.success('Banner images uploaded');
    } catch (error) {
      toast.error('Banner upload failed');
    } finally {
      setLoading(false);
    }
  };

  const updateAppSettings = async () => {
    await axios.post('/api/admin/updateAppSettings', {
      id: '1',
      data: {
        appWebsite: appInfo.appWebsite,
        contactNumber: appInfo.contactPhone,
        whatsappNumber: appInfo.whatsapp,
        contactEmail: appInfo.email,
        registrationBonus: appInfo.regBonus,
        RefferalBonus: appInfo.refBonus,
        homeBannerImage1: media.bannerUrls[0] || appInfo.homeBannerImage1,
        homeBannerImage2: media.bannerUrls[1] || appInfo.homeBannerImage2,
        homeBannerImage3: media.bannerUrls[2] || appInfo.homeBannerImage3,
        logo: logo,
        gameRules: post.gameRules,
        depositDetails: post.depositDetails,
        withdrawalDetails: post.withdrawalDetails,
        notice: post.notice,
      },
    });
  };

  const updateGameSettings = async () => {
    await axios.post('/api/admin/updateGameSettings', {
      id: '1',
      data: {
        withdrawal: gameSettings.withdrawalType,
        withdrawalLimit: gameSettings.withdrawalLimit,
        minimumWithdrawalAmount: gameSettings.minimumWithdrawalAmount,
        minimumDepositAmount: gameSettings.minimumDepositAmount,
        maximumSingleBiddingNumber: gameSettings.maxSingleBidNum,
        maximumSingleBiddingAmount: gameSettings.maxSingleBidAmt,
        minimumSingleBiddingAmount: gameSettings.minSingleBidAmt,
        maximumPattiBiddingNumber: gameSettings.maxPattiBidNum,
        maximumPattiBiddingAmount: gameSettings.maxPattiBidAmt,
        minimumPattiBiddingAmount: gameSettings.minPattiBidAmt,
        maximumJodiBiddingNumber: gameSettings.maxJodiBidNum,
        maximumJodiBiddingAmount: gameSettings.maxJodiBidAmt,
        minimumJodiBiddingAmount: gameSettings.minJodiBidAmt,
      },
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateAppSettings();
      await updateGameSettings();
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Error updating settings');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative max-w-2xl mx-auto px-4 py-6 space-y-6">
      <ToastContainer />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h2 className="text-2xl font-semibold">App Info</h2>
      {Object.entries(appInfo).map(([key, value]) => (
        <div key={key}>
          <label className="block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
          <input
            name={key}
            value={value}
            onChange={handleAppChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
      ))}

      {/* Banner Upload */}
      <div>
        <label className="block mb-1">Upload Banners</label>
        <input type="file" accept="image/*" multiple onChange={handleBannerUpload} />
        <div className="flex gap-2 mt-2">
          {(media.bannerUrls.length > 0
            ? media.bannerUrls
            : [appInfo.homeBannerImage1, appInfo.homeBannerImage2, appInfo.homeBannerImage3].filter(Boolean)
          ).map((url, i) => (
            <img key={i} src={url} alt={`Banner ${i + 1}`} className="w-32 h-20 object-cover border rounded" />
          ))}
        </div>

      </div>

      {/* Logo Upload */}
      <div>
        <label className="block mt-4 mb-1">Upload App Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            if (!e.target.files || e.target.files.length === 0) return;
            setLoading(true);
            try {
              const url = await uploadImageToCloudinary(e.target.files[0]);
              setLogo(url);
              toast.success('Logo uploaded');
            } catch (error) {
              toast.error('Logo upload failed');
            } finally {
              setLoading(false);
            }
          }}
        />

        {logo && (
          <div className="mt-2">
            <img src={logo} alt="App Logo" className="w-32 h-20 object-contain border rounded mb-1" />
            <code className="block text-sm text-gray-600 break-all">{logo}</code>
          </div>
        )}
      </div>


      {/* Rich Text Editors */}
      {Object.entries(post).map(([key, value]) => (
        <div key={key}>
          <label className="block font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
          {
            <RichTextEditor
              content={value}
              onChange={(newContent) => {
                setPost((prev) => ({ ...prev, [key]: newContent }));
              }}
            />
          }
        </div>
      ))}

      {/* Game Settings */}
      <h2 className="text-xl font-semibold mt-6">Game Settings</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Withdrawal Settings</h3>

        <div className="mb-3">
          <label className="block font-medium mb-1">Withdrawal Type</label>
          <select
            name="withdrawalType"
            value={gameSettings.withdrawalType}
            onChange={handleGameChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select</option>
            <option value="on">on</option>
            <option value="off">off</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Withdrawal Limit</label>
          <input
            type="number"
            name="withdrawalLimit"
            value={gameSettings.withdrawalLimit}
            onChange={handleGameChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Minimum Withdrawal Amount</label>
          <input
            type="number"
            name="minimumWithdrawalAmount"
            value={gameSettings.minimumWithdrawalAmount}
            onChange={handleGameChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Minimum Deposit Amount</label>
          <input
            type="number"
            name="minimumDepositAmount"
            value={gameSettings.minimumDepositAmount}
            onChange={handleGameChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>

      {Object.entries(gameSettings).map(([key, value]) => {
        if (
          ['withdrawalType', 'withdrawalLimit', 'minimumWithdrawalAmount', 'minimumDepositAmount'].includes(key)
        ) {
          return null;
        }

        return (
          <div className="mb-3" key={key}>
            <label className="block font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={key.includes('Time') ? 'time' : 'number'}
              name={key}
              value={value}
              onChange={handleGameChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        );
      })}

      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        Submit
      </button>
    </div>
  );
};

export default GameSettingsPage;
