import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="p-5">
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        {/* Contact Methods */}

        <div className="flex flex-col items-center border p-5 rounded-lg shadow-md w-full md:w-1/3">
          <h3 className="text-xl font-semibold mb-3">Instagram</h3>
          <p className="text-lg">@turbulent_hk</p>
          <a
            href="https://www.instagram.com/turbulent_hk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            className="mt-3 text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow us on Instagram
          </a>
        </div>
        <div className="flex flex-col items-center border p-5 rounded-lg shadow-md w-full md:w-1/3">
          <h3 className="text-xl font-semibold mb-3">WhatsApp</h3>
          <p className="text-lg">Turbulent Support</p>
          <a
            href="https://wa.me/85293442688"
            className="mt-3 text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </a>
        </div>

        {/* <div className="flex flex-col items-center border p-5 rounded-lg shadow-md w-full md:w-1/3">
          <h3 className="text-xl font-semibold mb-3">Email</h3>
          <p className="text-lg">support@yourstore.com</p>
          <a
            href="mailto:support@yourstore.com"
            className="mt-3 text-blue-500 hover:underline"
          >
            Send Us an Email
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default Contact;
