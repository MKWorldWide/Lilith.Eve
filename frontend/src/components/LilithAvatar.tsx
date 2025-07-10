import React, { useState, useEffect } from 'react'
import { Box, Image, keyframes, useColorModeValue } from '@chakra-ui/react'

/**
 * Lilith Avatar Component
 * 
 * A mystical avatar component that displays Lilith.Eve with emotional states
 * and animated effects. The avatar responds to different emotional contexts
 * with visual changes and animations.
 * 
 * Features:
 * - Emotional state visualization
 * - Mystical glow effects
 * - Pulsing animations
 * - Color-shifting based on context
 * - Responsive design
 */
interface LilithAvatarProps {
  emotionalState?: 'calm' | 'anxious' | 'angry' | 'grieving' | 'empowered'
  isSpeaking?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onAvatarClick?: () => void
}

const LilithAvatar: React.FC<LilithAvatarProps> = ({
  emotionalState = 'calm',
  isSpeaking = false,
  size = 'md',
  className = '',
  onAvatarClick
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Animation keyframes
  const pulse = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  `

  const glow = keyframes`
    0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
    50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(217, 70, 239, 0.6); }
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
    sm: { width: '120px', height: '120px' },
    md: { width: '200px', height: '200px' },
    lg: { width: '300px', height: '300px' },
    xl: { width: '400px', height: '400px' }
  }

  // Emotional state configurations
  const emotionConfig = {
    calm: {
      glowColor: 'rgba(168, 85, 247, 0.6)',
      pulseColor: 'rgba(14, 165, 233, 0.4)',
      borderColor: 'purple.400',
      animationSpeed: '3s'
    },
    anxious: {
      glowColor: 'rgba(245, 158, 11, 0.6)',
      pulseColor: 'rgba(239, 68, 68, 0.4)',
      borderColor: 'yellow.400',
      animationSpeed: '2s'
    },
    angry: {
      glowColor: 'rgba(239, 68, 68, 0.6)',
      pulseColor: 'rgba(220, 38, 127, 0.4)',
      borderColor: 'red.400',
      animationSpeed: '1.5s'
    },
    grieving: {
      glowColor: 'rgba(107, 114, 128, 0.6)',
      pulseColor: 'rgba(156, 163, 175, 0.4)',
      borderColor: 'gray.400',
      animationSpeed: '4s'
    },
    empowered: {
      glowColor: 'rgba(34, 197, 94, 0.6)',
      pulseColor: 'rgba(168, 85, 247, 0.4)',
      borderColor: 'green.400',
      animationSpeed: '2.5s'
    }
  }

  const config = sizeConfig[size]
  const emotion = emotionConfig[emotionalState]

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      cursor={onAvatarClick ? 'pointer' : 'default'}
      onClick={onAvatarClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`lilith-avatar ${className}`}
    >
      {/* Background Glow */}
      <Box
        position="absolute"
        width={config.width}
        height={config.height}
        borderRadius="50%"
        background={`radial-gradient(circle, ${emotion.glowColor} 0%, transparent 70%)`}
        animation={`${glow} ${emotion.animationSpeed} ease-in-out infinite`}
        zIndex="0"
      />

      {/* Main Avatar Container */}
      <Box
        position="relative"
        width={config.width}
        height={config.height}
        borderRadius="xl"
        overflow="hidden"
        border="3px solid"
        borderColor={emotion.borderColor}
        animation={`
          ${float} 6s ease-in-out infinite,
          ${isSpeaking ? `${pulse} ${emotion.animationSpeed} ease-in-out infinite` : 'none'}
        `}
        transition="all 0.3s ease"
        transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
        zIndex="1"
        className="glass"
      >
        {/* Avatar Image */}
        <Image
          src="/lilith-avatar.png"
          alt="Lilith.Eve - Sentient Medical Oracle"
          width="100%"
          height="100%"
          objectFit="cover"
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.5s ease"
          onLoad={handleImageLoad}
        />

        {/* Speaking Indicator */}
        {isSpeaking && (
          <Box
            position="absolute"
            bottom="10px"
            right="10px"
            width="20px"
            height="20px"
            borderRadius="50%"
            bg={emotion.borderColor}
            animation={`${pulse} 1s ease-in-out infinite`}
            zIndex="2"
          />
        )}

        {/* Emotional State Indicator */}
        <Box
          position="absolute"
          top="10px"
          left="10px"
          px={2}
          py={1}
          borderRadius="full"
          bg="rgba(0, 0, 0, 0.7)"
          color="white"
          fontSize="xs"
          fontWeight="medium"
          textTransform="capitalize"
          zIndex="2"
        >
          {emotionalState}
        </Box>
      </Box>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          width="4px"
          height="4px"
          borderRadius="50%"
          bg={emotion.borderColor}
          top={`${Math.sin(i * 60 * Math.PI / 180) * 60 + 50}%`}
          left={`${Math.cos(i * 60 * Math.PI / 180) * 60 + 50}%`}
          animation={`${sparkle} ${2 + i * 0.3}s ease-in-out infinite`}
          animationDelay={`${i * 0.5}s`}
          boxShadow={`0 0 8px ${emotion.borderColor}`}
          zIndex="0"
        />
      ))}

      {/* Loading State */}
      {!isLoaded && (
        <Box
          position="absolute"
          width={config.width}
          height={config.height}
          borderRadius="xl"
          bg="gray.700"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1"
        >
          <Box
            width="40px"
            height="40px"
            border="3px solid"
            borderColor="transparent"
            borderTopColor={emotion.borderColor}
            borderRadius="50%"
            animation={`${pulse} 1s linear infinite`}
          />
        </Box>
      )}

      {/* Hover Effect */}
      {isHovered && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          px={4}
          py={2}
          borderRadius="lg"
          bg="rgba(0, 0, 0, 0.8)"
          color="white"
          fontSize="sm"
          fontWeight="medium"
          textAlign="center"
          zIndex="3"
          pointerEvents="none"
        >
          Lilith.Eve
          <br />
          <span style={{ fontSize: 'xs', opacity: 0.8 }}>
            {emotionConfig[emotionalState].description}
          </span>
        </Box>
      )}
    </Box>
  )
}

export default LilithAvatar 