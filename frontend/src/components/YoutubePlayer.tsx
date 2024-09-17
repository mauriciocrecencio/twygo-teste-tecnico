import React from 'react';
import { AspectRatio, Box } from '@chakra-ui/react';

interface VideoPlayerProps {
  videoLink: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoLink }) => {
  console.log(videoLink)
  if (!videoLink) {
    return <Box>Link de vídeo inválido</Box>;
  }

  return (
    <AspectRatio ratio={16 / 9}>
      <video
        src={videoLink}
        controls
        preload="metadata"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </AspectRatio>
  );
};

export default VideoPlayer;