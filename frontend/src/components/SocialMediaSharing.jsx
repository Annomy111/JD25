import React from 'react';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton
} from 'react-share';

const SocialMediaSharing = ({ url, title, description }) => {
  return (
    <div className="flex space-x-4 items-center">
      <FacebookShareButton
        url={url}
        quote={description}
        className="transition-transform hover:scale-110"
      >
        <div className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Facebook
        </div>
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={title}
        className="transition-transform hover:scale-110"
      >
        <div className="bg-sky-500 text-white px-4 py-2 rounded-md">
          Twitter
        </div>
      </TwitterShareButton>

      <WhatsappShareButton
        url={url}
        title={title}
        className="transition-transform hover:scale-110"
      >
        <div className="bg-green-500 text-white px-4 py-2 rounded-md">
          WhatsApp
        </div>
      </WhatsappShareButton>

      <EmailShareButton
        url={url}
        subject={title}
        body={description}
        className="transition-transform hover:scale-110"
      >
        <div className="bg-gray-600 text-white px-4 py-2 rounded-md">
          E-Mail
        </div>
      </EmailShareButton>
    </div>
  );
};

export default SocialMediaSharing;