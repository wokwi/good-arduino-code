import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { reportEvent } from '../services/analytics';
import { projectUrl } from '../services/urls';

export interface ISharingButtonProps {
  projectId: string;
}

export function SharingButtons({ projectId }: ISharingButtonProps) {
  const url = projectUrl(projectId);
  const shareEvent = (network: string) => () => {
    reportEvent({ action: network, category: 'share', label: projectId });
  };
  return (
    <span className="social-icons">
      <RedditShareButton url={url} onClick={shareEvent('reddit')}>
        <RedditIcon size={32} round />
      </RedditShareButton>
      <FacebookShareButton url={url} onClick={shareEvent('facebook')}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} onClick={shareEvent('twitter')}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} onClick={shareEvent('linkedin')}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <style jsx>{`
        .social-icons > :global(button) {
          margin-right: 4px;
        }
      `}</style>
    </span>
  );
}
