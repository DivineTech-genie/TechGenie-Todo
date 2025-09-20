"use client";

import { fetchAvatars } from "@/app/supabase_actions/fetchData";
import { insertAvatar } from "@/app/supabase_actions/insertData";
import ProfileCom from "@/components/ProfileCom";
import { ChangeEvent, useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";

const Profile = () => {
  const [avatar, setAvatar] = useState<string>("");

  // Sample user data
  const user = {
    name: "Alex Johnson",
    bio: "Frontend developer passionate about creating beautiful and functional user interfaces. Love working with React, TypeScript, and Tailwind CSS.",
    avatar:
      "https://ddddaxgbqmfpmyopdasc.supabase.co/storage/v1/object/public/avatar/funkyalien.jpg", // This would be replaced with your actual avatar path
  };

  const ProfileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;
    const filePath = e.target.files[0];
    const avatarUrl = URL.createObjectURL(filePath);

    insertAvatar(filePath, user.name).then(() => {
      setAvatar(avatarUrl);
    });
  };

  useEffect(() => {
    fetchAvatars().then((profileUrl) => {
      if (profileUrl) {
        setAvatar(profileUrl);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex gap-1 items-center justify-center relative">
            <ProfileCom size="full" avatarUrl={avatar} />
            <button className="text-white relative cursor-pointer shadow-md hover:text-gray-100 transition">
              <input
                type="file"
                className="absolute top-0 left-0 opacity-0 w-full h-full"
                onChange={ProfileUpload}
              />
              <FiEdit3 size={18} />
            </button>
          </div>
        </div>
        {/* Profile Content */}
        <div className="px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="mt-4 text-gray-600">{user.bio}</p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 divide-x divide-gray-200 border-t border-b border-gray-200 py-4">
            <div className="px-2">
              <p className="text-xl font-bold text-gray-900">128</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div className="px-2">
              <p className="text-xl font-bold text-gray-900">1.2K</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="px-2">
              <p className="text-xl font-bold text-gray-900">350</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>

          {/* Action Button */}
          <button className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
