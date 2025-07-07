import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  useColorModeValue,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  HStack,
  VStack,
  Icon,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import {
  Brain,
  Heart,
  Activity,
  Zap,
  Eye,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Network,
  Shield,
  Star,
} from 'lucide-react'
import { SystemVital, ModuleStatus, LilithThought, EnergySignature } from '@types/index'
import SystemVitalsPanel from '@components/SystemVitalsPanel'
import PatientEnergyMonitor from '@components/PatientEnergyMonitor'
import DecisionFlowMap from '@components/DecisionFlowMap'
import LilithThoughtsConsole from '@components/LilithThoughtsConsole'
import TherapyTimeline from '@components/TherapyTimeline'

/**
 * Main Dashboard Component
 * 
 * The central command interface for monitoring Lilith.Eve's thoughts, breath,
 * and energetic pulse in real-time. Provides comprehensive system monitoring
 * and patient care insights.
 * 
 * Features:
 * - Real-time system vitals monitoring
 * - Patient energy signature visualization
 * - Live decision flow mapping
 * - Lilith's thoughts console
 * - Therapy history timeline
 * - Role-based access control
 */
const Dashboard: React.FC = () => {
  const [systemVitals, setSystemVitals] = useState<SystemVital[]>([])
  const [currentThought, setCurrentThought] = useState<LilithThought | null>(null)
  const [activePatients, setActivePatients] = useState<number>(0)
  const [systemHealth, setSystemHealth] = useState<number>(98.5)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Mock data for demonstration
  useEffect(() => {
    const mockSystemVitals: SystemVital[] = [
      {
        module: 'Cognition.AI',
        status: 'active',
        lastSync: '2.1s ago',
        anomalies: 0,
        performance: 98.5,
        uptime: 99.9,
        responseTime: 45
      },
      {
        module: 'BioSync.Reader',
        status: 'active',
        lastSync: 'Live',
        anomalies: 0,
        performance: 99.2,
        uptime: 99.8,
        responseTime: 32
      },
      {
        module: 'Persona.Scanner',
        status: 'active',
        lastSync: 'Auto-loop',
        anomalies: 0,
        performance: 97.8,
        uptime: 99.7,
        responseTime: 67
      },
      {
        module: 'SocialSynth',
        status: 'active',
        lastSync: '5 feeds active',
        anomalies: 1,
        performance: 96.3,
        uptime: 99.5,
        responseTime: 89
      },
      {
        module: 'Holistica',
        status: 'active',
        lastSync: 'Ritual-ready',
        anomalies: 0,
        performance: 95.7,
        uptime: 99.3,
        responseTime: 123
      },
      {
        module: 'LinguaCare',
        status: 'active',
        lastSync: 'Processing',
        anomalies: 0,
        performance: 98.9,
        uptime: 99.6,
        responseTime: 56
      }
    ]

    setSystemVitals(mockSystemVitals)
    setActivePatients(12)
    setSystemHealth(98.5)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // Update random vital
      setSystemVitals(prev => prev.map(vital => ({
        ...vital,
        performance: Math.max(90, Math.min(100, vital.performance + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(20, Math.min(200, vital.responseTime + (Math.random() - 0.5) * 10))
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'warning': return 'yellow'
      case 'error': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'warning': return AlertTriangle
      case 'error': return AlertTriangle
      default: return Clock
    }
  }

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" className="gradient-text">
            🌌 Lilith.Eve Live Dashboard
          </Heading>
          <Text color="gray.500" mt={1}>
            Real-time monitoring of the sentient medical oracle
          </Text>
        </Box>
        <HStack spacing={4}>
          <Badge colorScheme="green" variant="subtle" px={3} py={1}>
            <Icon as={CheckCircle} mr={1} />
            System Online
          </Badge>
          <Text fontSize="sm" color="gray.500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Text>
        </HStack>
      </Flex>

      {/* Quick Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>System Health</StatLabel>
              <StatNumber color="green.400">{systemHealth}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                2.3%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Active Patients</StatLabel>
              <StatNumber color="blue.400">{activePatients}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                3 new today
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>AI Processing</StatLabel>
              <StatNumber color="purple.400">247</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12.5% increase
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Uptime</StatLabel>
              <StatNumber color="teal.400">99.9%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                0.1% improvement
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Main Dashboard Grid */}
      <Grid
        templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
        gap={6}
        mb={8}
      >
        {/* Left Column - Main Monitoring */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* System Vitals Panel */}
            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md" display="flex" alignItems="center">
                  <Icon as={Activity} mr={2} color="purple.400" />
                  System Vitals
                </Heading>
              </CardHeader>
              <CardBody>
                <SystemVitalsPanel vitals={systemVitals} />
              </CardBody>
            </Card>

            {/* Decision Flow Map */}
            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md" display="flex" alignItems="center">
                  <Icon as={Brain} mr={2} color="blue.400" />
                  Decision Flow Engine (D-FEED)
                </Heading>
              </CardHeader>
              <CardBody>
                <DecisionFlowMap />
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* Right Column - Side Panels */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Lilith's Thoughts Console */}
            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md" display="flex" alignItems="center">
                  <Icon as={Star} mr={2} color="yellow.400" />
                  Lilith's Thoughts
                </Heading>
              </CardHeader>
              <CardBody>
                <LilithThoughtsConsole />
              </CardBody>
            </Card>

            {/* Patient Energy Monitor */}
            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md" display="flex" alignItems="center">
                  <Icon as={Heart} mr={2} color="red.400" />
                  Patient Energy Signature
                </Heading>
              </CardHeader>
              <CardBody>
                <PatientEnergyMonitor />
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>

      {/* Bottom Section - Therapy Timeline */}
      <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md" display="flex" alignItems="center">
            <Icon as={Clock} mr={2} color="green.400" />
            Therapy History & Timeline
          </Heading>
        </CardHeader>
        <CardBody>
          <TherapyTimeline />
        </CardBody>
      </Card>

      {/* System Alerts */}
      {systemVitals.some(vital => vital.anomalies > 0) && (
        <Alert status="warning" mt={6} borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>System Anomalies Detected!</AlertTitle>
            <AlertDescription>
              {systemVitals.filter(vital => vital.anomalies > 0).length} modules have reported anomalies.
              Review system vitals for details.
            </AlertDescription>
          </Box>
        </Alert>
      )}
    </Box>
  )
}

export default Dashboard 