// src/components/layout/Footer.tsx
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-purple-900 text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">B-World</h3>
                        <div className="flex gap-4">
                            <Facebook className="w-5 h-5" />
                            <Twitter className="w-5 h-5" />
                            <Instagram className="w-5 h-5" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Categories</h4>
                        <ul className="space-y-1 text-sm">
                            <li>Psychology</li>
                            <li>Self-Help</li>
                            <li>Romance</li>
                            <li>Mystery</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">For kids</h4>
                        <ul className="space-y-1 text-sm">
                            <li>Games</li>
                            <li>Comics</li>
                            <li>Fantasy</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Help & Contacts</h4>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                +445 87 999 000
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                b.world@store.ro
                            </p>
                            <p>Mo-Fri, 9 AM to 11 PM</p>
                            <Button variant="outline" size="sm" className="mt-2">
                                Request a call
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="text-center text-sm pt-8 border-t border-purple-800">
                    <p>© All copyrights are reserved. B-World, 2022</p>
                </div>
            </div>
        </footer>
    );
}