import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Box, useColorModeValue, Switch, FormControl, FormLabel, Tooltip } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our soulprint data
type NodeType = 'trauma' | 'karmic' | 'soul-gift' | 'lineage' | 'archetype';

interface SoulNode {
  id: string;
  type: NodeType;
  label: string;
  size: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  color: string;
  description?: string;
  intensity?: number;
  connections?: string[];
  timestamp?: string;
}

interface SoulLink {
  source: string;
  target: string;
  value: number;
  type: 'lineage' | 'karmic' | 'trauma-bond' | 'soul-contract';
}

interface SoulprintData {
  nodes: SoulNode[];
  links: SoulLink[];
}

const SoulprintVisualizer: React.FC<{ sessionId: string; width?: number; height?: number }> = ({
  sessionId,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [showSpiritualClarity, setShowSpiritualClarity] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SoulNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [soulprintData, setSoulprintData] = useState<SoulprintData | null>(null);

  // Color scheme using Chakra's theming
  const colors = {
    bg: useColorModeValue('white', 'gray.900'),
    text: useColorModeValue('gray.800', 'whiteAlpha.900'),
    node: {
      trauma: useColorModeValue('#E53E3E', '#FEB2B2'),
      karmic: useColorModeValue('#D69E2E', '#F6E05E'),
      'soul-gift': useColorModeValue('#38B2AC', '#81E6D9'),
      lineage: useColorModeValue('#805AD5', '#B794F4'),
      archetype: useColorModeValue('#4299E1', '#90CDF4'),
    },
    link: {
      lineage: useColorModeValue('#B794F4', '#805AD5'),
      karmic: useColorModeValue('#F6E05E', '#D69E2E'),
      'trauma-bond': useColorModeValue('#FC8181', '#E53E3E'),
      'soul-contract': useColorModeValue('#68D391', '#38A169'),
    },
  };

  // Mock data - in a real app, this would come from your API
  const generateMockData = (): SoulprintData => {
    const nodes: SoulNode[] = [
      {
        id: 'core-self',
        type: 'soul-gift',
        label: 'Core Self',
        size: 20,
        color: colors.node['soul-gift'],
        description: 'The eternal essence of the soul',
      },
      {
        id: 'mother-wound',
        type: 'trauma',
        label: 'Mother Wound',
        size: 16,
        color: colors.node.trauma,
        intensity: 0.8,
        description: 'Intergenerational patterns of emotional neglect',
      },
      {
        id: 'healer-archetype',
        type: 'archetype',
        label: 'Wounded Healer',
        size: 14,
        color: colors.node.archetype,
        description: 'The capacity to heal others through one\'s own wounds',
      },
    ];

    const links: SoulLink[] = [
      {
        source: 'mother-wound',
        target: 'core-self',
        value: 0.8,
        type: 'trauma-bond',
      },
      {
        source: 'core-self',
        target: 'healer-archetype',
        value: 0.6,
        type: 'soul-contract',
      },
    ];

    return { nodes, links };
  };

  // Initialize the force-directed graph
  useEffect(() => {
    // In a real app, you would fetch this data
    const data = generateMockData();
    setSoulprintData(data);
    setIsLoading(false);

    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Set up the simulation
    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.size * 1.5));

    // Create links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', (d) => colors.link[d.type])
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.value) * 2);

    // Create node groups
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag()
          .on('start', dragstarted as any)
          .on('drag', dragged as any)
          .on('end', dragended as any)
      )
      .on('click', (event, d) => setSelectedNode(d));

    // Add circles to the nodes
    node
      .append('circle')
      .attr('r', (d) => d.size)
      .attr('fill', (d) => d.color)
      .attr('opacity', 0.8)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Add labels
    node
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.size + 15)
      .attr('fill', colors.text)
      .style('font-size', '10px')
      .style('pointer-events', 'none');

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = event.x;
      d.fy = event.y;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [sessionId, showSpiritualClarity, width, height]);

  if (isLoading) {
    return (
      <Box
        width={`${width}px`}
        height={`${height}px`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Loading soulprint...
      </Box>
    );
  }

  return (
    <Box position="relative" width={`${width}px`} height={`${height}px`}>
      {/* Toggle for Spiritual Clarity Mode */}
      <Box position="absolute" top={2} right={2} zIndex={10} bg="whiteAlpha.800" p={2} borderRadius="md" boxShadow="sm">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="spiritual-clarity" mb="0" fontSize="sm">
            Spiritual Clarity
          </FormLabel>
          <Switch
            id="spiritual-clarity"
            isChecked={showSpiritualClarity}
            onChange={(e) => setShowSpiritualClarity(e.target.checked)}
            colorScheme="purple"
          />
        </FormControl>
      </Box>

      {/* Main SVG */}
      <Box
        as="svg"
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        bg={colors.bg}
        borderRadius="lg"
        boxShadow="lg"
      />

      {/* Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: '250px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box
                as="h3"
                fontSize="lg"
                fontWeight="bold"
                color={selectedNode.color}
                textTransform="capitalize"
              >
                {selectedNode.label}
              </Box>
              <Box
                as="span"
                fontSize="xs"
                px={2}
                py={1}
                bg={`${selectedNode.color}20`}
                color={selectedNode.color}
                borderRadius="full"
                textTransform="capitalize"
              >
                {selectedNode.type}
              </Box>
            </Box>
            
            {selectedNode.description && (
              <Box fontSize="sm" color="gray.700" mb={3}>
                {selectedNode.description}
              </Box>
            )}
            
            {selectedNode.intensity !== undefined && (
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box as="span" fontSize="xs" color="gray.500">
                    Intensity
                  </Box>
                  <Box as="span" fontSize="xs" fontWeight="medium">
                    {Math.round(selectedNode.intensity * 100)}%
                  </Box>
                </Box>
                <Box
                  height="4px"
                  bg="gray.100"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    height="100%"
                    width={`${selectedNode.intensity * 100}%`}
                    bg={selectedNode.color}
                    borderRadius="full"
                  />
                </Box>
              </Box>
            )}
            
            <Box mt={4} pt={3} borderTopWidth="1px" borderTopColor="gray.100">
              <Box as="button" 
                onClick={() => setSelectedNode(null)}
                fontSize="sm" 
                color="purple.600"
                _hover={{ textDecoration: 'underline' }}
              >
                Close
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SoulprintVisualizer;
