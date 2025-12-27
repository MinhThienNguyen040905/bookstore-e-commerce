import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, Lock, User, Mail, Phone as PhoneIcon, MapPin } from 'lucide-react';
import { ProfileField } from '../ProfileField';

export function ProfileTab() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-stone-100">
                        <AvatarImage src={user?.avatar || ''} className="object-cover" />
                        <AvatarFallback className="text-2xl bg-stone-200 text-stone-500 font-bold">
                            {user?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-2 bg-[#0df2d7] text-stone-900 rounded-full hover:bg-[#00dcc3] shadow-sm transition-colors" title="Change Avatar">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center sm:text-left flex-1">
                    <h2 className="text-xl font-bold font-display text-stone-900">{user?.name}</h2>
                    <p className="text-stone-500 text-sm mb-4">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                    <div className="flex gap-3 justify-center sm:justify-start">
                        <Button variant="outline" className="border-stone-200 text-stone-600 hover:bg-stone-50 h-9 text-sm">
                            Change Avatar
                        </Button>
                        <Button variant="outline" className="border-stone-200 text-stone-600 hover:bg-stone-50 h-9 text-sm">
                            Delete Avatar
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold font-display text-stone-900">Personal Information</h3>
                </div>

                <div className="space-y-6">
                    {/* Email (Read Only) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center border-b border-stone-100 pb-6">
                        <Label className="text-stone-500 font-medium">Email Address</Label>
                        <div className="md:col-span-2 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-stone-900 font-medium">
                                <Mail className="w-4 h-4 text-[#00bbb6]" />
                                {user?.email}
                            </div>
                            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded">Read-only</span>
                        </div>
                    </div>

                    <ProfileField
                        label="Full Name"
                        value={user?.name || ''}
                        icon={<User className="w-4 h-4 text-[#00bbb6]" />}
                        fieldKey="name"
                    />

                    <ProfileField
                        label="Phone Number"
                        value={user?.phone || ''}
                        icon={<PhoneIcon className="w-4 h-4 text-[#00bbb6]" />}
                        fieldKey="phone"
                        inputType="tel"
                    />

                    <ProfileField
                        label="Address"
                        value={user?.address || ''}
                        icon={<MapPin className="w-4 h-4 text-[#00bbb6]" />}
                        fieldKey="address"
                    />
                </div>
            </div>

            {/* 3. Security Section */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold font-display text-stone-900 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#00bbb6]" /> Security
                    </h3>
                    <p className="text-stone-500 text-sm mt-1">Manage your password and account security.</p>
                </div>
                <Button className="bg-[#0df2d7] text-stone-900 hover:bg-[#00dcc3] font-bold">
                    Change Password
                </Button>
            </div>
        </div>
    );
}