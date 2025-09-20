import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface avatarProps {
  size: string;
  avatarUrl?: string;
}

const userName = "John Doe";

const ProfileCom = ({ size, avatarUrl }: avatarProps) => {
  return (
    <div>
      <Avatar>
        <AvatarImage src={avatarUrl} className={`${size}`} />
        <AvatarFallback className={`${size}`}>
          {userName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileCom;
