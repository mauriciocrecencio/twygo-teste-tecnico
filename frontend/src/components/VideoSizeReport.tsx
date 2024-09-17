import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const VideoSizeReport: React.FC = () => {
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    const fetchTotalSize = async () => {
      const size = 0
      setTotalSize(size);
    };
    fetchTotalSize();
  }, []);

  return (
    <Box>
      <Heading as="h2" size="xl" mb={4}>
        Relatório de Tamanho de Vídeos
      </Heading>
      <VStack align="start" spacing={4}>
        <Text fontSize="lg">
          Tamanho total ocupado pelos vídeos: {(totalSize / (1024 * 1024)).toFixed(2)} MB
        </Text>
      </VStack>
    </Box>
  );
};

export default VideoSizeReport;