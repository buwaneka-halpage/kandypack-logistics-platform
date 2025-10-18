import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function CustomerHelpAndSupport() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Us Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">About Us</h2>
          <Card className="p-6 space-y-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div className="space-y-1">
                <div className="font-medium">
                  KandyPack Manufacturing Company,
                </div>
                <div className="text-gray-600">31 Kandy Road, Kandy</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div className="text-gray-600">+94 81 123 4567</div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div className="text-gray-600">Kandypack@Kandypack.Lk</div>
            </div>
          </Card>
        </div>

        {/* Leave A Message Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Leave A Message</h2>
          <Card className="p-6">
            <form className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm text-gray-600">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    className="bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm text-gray-600">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-600">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="bg-white border-gray-200"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-gray-600">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Type your message here..."
                  className="min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#4263eb] text-white px-6 py-2 rounded-md font-medium hover:bg-[#3b5bde] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4263eb] focus:ring-offset-2"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
