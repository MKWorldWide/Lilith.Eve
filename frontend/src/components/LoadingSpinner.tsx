import React from 'react'
import { Box, Flex, Text, keyframes } from '@chakra-ui/react'
import { LoadingSpinnerProps } from '@types/index'

/**
 * Mystical Loading Spinner Component
 * 
 * A beautiful, spiritual-themed loading spinner that embodies the mystical
 * nature of Lilith.Eve. Features animated elements and gradient effects.
 * 
 * Features:
 * - Animated rotating elements
 * - Gradient color effects
 * - Pulsing glow animations
 * - Customizable size and color
 * - Optional loading text
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'purple.500',
  text = 'Lilith.Eve is awakening...'
}) => {
  // Animation keyframes
  const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `

  const pulse = keyframes`
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  `

  const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  `

  const sparkle = keyframes`
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
  `

  // Size configurations
  const sizeConfig = {
    sm: { width: '40px', height: '40px', fontSize: 'sm' },
    md: { width: '60px', height: '60px', fontSize: 'md' },
    lg: { width: '80px', height: '80px', fontSize: 'lg' }
  }

  const config = sizeConfig[size]

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="200px"
      position="relative"
    >
      {/* Main Spinner Container */}
      <Box
        position="relative"
        width={config.width}
        height={config.height}
        animation={`${rotate} 3s linear infinite`}
      >
        {/* Outer Ring */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          borderRadius="50%"
          border="3px solid"
          borderColor="transparent"
          borderTopColor={color}
          borderRightColor={`${color}40`}
          borderBottomColor={`${color}20`}
          borderLeftColor={`${color}60`}
          animation={`${pulse} 2s ease-in-out infinite`}
        />

        {/* Inner Ring */}
        <Box
          position="absolute"
          top="25%"
          left="25%"
          width="50%"
          height="50%"
          borderRadius="50%"
          border="2px solid"
          borderColor="transparent"
          borderTopColor={`${color}80`}
          borderRightColor={`${color}40`}
          borderBottomColor={`${color}20`}
          borderLeftColor={`${color}60`}
          animation={`${rotate} 2s linear infinite reverse`}
        />

        {/* Center Dot */}
        <Box
          position="absolute"
          top="40%"
          left="40%"
          width="20%"
          height="20%"
          borderRadius="50%"
          bg={color}
          animation={`${pulse} 1.5s ease-in-out infinite`}
          boxShadow={`0 0 10px ${color}, 0 0 20px ${color}60`}
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            width="4px"
            height="4px"
            borderRadius="50%"
            bg={color}
            top={`${Math.sin(i * 60 * Math.PI / 180) * 35 + 50}%`}
            left={`${Math.cos(i * 60 * Math.PI / 180) * 35 + 50}%`}
            animation={`${sparkle} ${1 + i * 0.2}s ease-in-out infinite`}
            animationDelay={`${i * 0.3}s`}
            boxShadow={`0 0 5px ${color}`}
          />
        ))}
      </Box>

      {/* Loading Text */}
      {text && (
        <Text
          mt={4}
          fontSize={config.fontSize}
          color="gray.300"
          textAlign="center"
          fontWeight="medium"
          className="gradient-text"
          animation={`${float} 4s ease-in-out infinite`}
        >
          {text}
          <span className="loading-dots"></span>
        </Text>
      )}

      {/* Background Glow Effect */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="200px"
        height="200px"
        borderRadius="50%"
        background={`radial-gradient(circle, ${color}20 0%, transparent 70%)`}
        animation={`${pulse} 3s ease-in-out infinite`}
        zIndex="-1"
      />
    </Flex>
  )
}

export default LoadingSpinner 