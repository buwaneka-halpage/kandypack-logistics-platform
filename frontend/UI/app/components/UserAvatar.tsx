import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  name, 
  size = 'md',
  className = '' 
}) => {
  // Generate initials from name
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Generate a consistent color based on name
  const getBackgroundColor = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const initials = getInitials(name);
  const backgroundColorClass = getBackgroundColor(name);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {src && (
        <AvatarImage
          src={src}
          alt={name}
          className="object-cover"
        />
      )}
      <AvatarFallback 
        className={`${backgroundColorClass} text-white font-medium ${textSizes[size]} border-0`}
      >
        {initials || <User className={iconSizes[size]} />}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;