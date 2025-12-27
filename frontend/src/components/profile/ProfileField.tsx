import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Check, X } from 'lucide-react';
import { showToast } from '@/lib/toast';

interface ProfileFieldProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    fieldKey: string;
    inputType?: string;
}

export function ProfileField({ label, value, icon, fieldKey, inputType = "text" }: ProfileFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleSave = () => {
        // TODO: Gọi API cập nhật user tại đây
        console.log(`Saving ${fieldKey}: ${tempValue}`);
        showToast.success(`${label} updated successfully!`);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center border-b border-stone-100 pb-6 last:border-0 last:pb-0">
            <Label className="text-stone-500 font-medium">{label}</Label>
            <div className="md:col-span-2 flex items-center justify-between gap-4">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full animate-in fade-in zoom-in-95 duration-200">
                        <Input
                            type={inputType}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="h-10 border-[#0df2d7] ring-2 ring-[#0df2d7]/20 bg-white"
                            autoFocus
                        />
                        <Button size="icon" onClick={handleSave} className="h-10 w-10 bg-[#0df2d7] hover:bg-[#00dcc3] text-stone-900 shrink-0">
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={handleCancel} className="h-10 w-10 border-stone-200 text-stone-500 hover:text-red-500 hover:bg-red-50 shrink-0">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 text-stone-900 font-medium truncate">
                            {icon}
                            {value || <span className="text-stone-400 italic">Not set</span>}
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-stone-400 hover:text-[#00bbb6] hover:bg-[#0df2d7]/10 rounded-full transition-all"
                            title="Edit"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}