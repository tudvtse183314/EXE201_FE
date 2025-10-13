import React from 'react';
import { motion } from 'framer-motion';
import { usePetVibeTheme } from '../../hooks/usePetVibeTheme';
import { 
  PetVibeButton, 
  PetVibeCard, 
  PetVibeInput, 
  PetVibeContainer,
  PetVibeSection,
  PetVibeHeading,
  PetVibeText,
  PetVibeFlex,
  PetVibeGrid,
  PetVibeSpacer,
  PetVibeDivider
} from '../../styles/styledComponents';

const ThemeDemo = () => {
  const theme = usePetVibeTheme();

  return (
    <div className="min-h-screen bg-pv-light">
      {/* Header */}
      <motion.div 
        className="pv-bg-gradient-hero text-white py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PetVibeContainer>
          <PetVibeHeading size="4xl" color="white" centered>
            🎨 PetVibe Theme Demo
          </PetVibeHeading>
          <PetVibeText color="white" centered>
            Unified color palette with warm, friendly pet care aesthetic
          </PetVibeText>
        </PetVibeContainer>
      </motion.div>

      <PetVibeContainer>
        <PetVibeSpacer size="2xl" />

        {/* Color Palette */}
        <PetVibeSection>
          <PetVibeHeading size="3xl" centered>
            Color Palette
          </PetVibeHeading>
          <PetVibeText centered marginBottom="2xl">
            The core PetVibe brand colors based on brown-orange-cream theme
          </PetVibeText>

          <PetVibeGrid cols={5} gap="lg">
            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-primary rounded-lg mb-4"></div>
              <PetVibeText weight="semibold">Primary</PetVibeText>
              <PetVibeText size="sm" color="muted">#F6A623</PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-secondary rounded-lg mb-4"></div>
              <PetVibeText weight="semibold">Secondary</PetVibeText>
              <PetVibeText size="sm" color="muted">#D97B29</PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-dark rounded-lg mb-4"></div>
              <PetVibeText weight="semibold">Dark</PetVibeText>
              <PetVibeText size="sm" color="muted">#4B2E05</PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-light rounded-lg mb-4 border-2 border-gray-200"></div>
              <PetVibeText weight="semibold">Light</PetVibeText>
              <PetVibeText size="sm" color="muted">#FFF8E7</PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-accent rounded-lg mb-4"></div>
              <PetVibeText weight="semibold">Accent</PetVibeText>
              <PetVibeText size="sm" color="muted">#E86100</PetVibeText>
            </PetVibeCard>
          </PetVibeGrid>
        </PetVibeSection>

        <PetVibeDivider />

        {/* Gradients */}
        <PetVibeSection>
          <PetVibeHeading size="3xl" centered>
            Gradients
          </PetVibeHeading>
          <PetVibeText centered marginBottom="2xl">
            Beautiful gradient combinations for backgrounds and buttons
          </PetVibeText>

          <PetVibeGrid cols={3} gap="lg">
            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-gradient-warm-glow rounded-lg mb-4"></div>
              <PetVibeText weight="semibold">Warm Glow</PetVibeText>
              <PetVibeText size="sm" color="muted">Primary to Accent</PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-gradient-soft-sun rounded-lg mb-4"></div>
              <PetVibeText weight="semibold">Soft Sun</PetVibeText>
              <PetVibeText size="sm" color="muted">Light to Primary</PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable>
              <div className="w-full h-20 bg-pv-gradient-sunset rounded-lg mb-4"></div>
              <PetVibeText weight="semibold">Sunset</PetVibeText>
              <PetVibeText size="sm" color="muted">Full Spectrum</PetVibeText>
            </PetVibeCard>
          </PetVibeGrid>
        </PetVibeSection>

        <PetVibeDivider />

        {/* Buttons */}
        <PetVibeSection>
          <PetVibeHeading size="3xl" centered>
            Button Variants
          </PetVibeHeading>
          <PetVibeText centered marginBottom="2xl">
            Different button styles for various use cases
          </PetVibeText>

          <PetVibeFlex justify="center" gap="lg" wrap>
            <PetVibeButton variant="primary">
              Primary Button
            </PetVibeButton>
            <PetVibeButton variant="secondary">
              Secondary Button
            </PetVibeButton>
            <PetVibeButton variant="accent">
              Accent Button
            </PetVibeButton>
            <PetVibeButton variant="outline">
              Outline Button
            </PetVibeButton>
          </PetVibeFlex>

          <PetVibeSpacer size="lg" />

          <PetVibeFlex justify="center" gap="lg" wrap>
            <PetVibeButton variant="primary" rounded>
              Rounded Primary
            </PetVibeButton>
            <PetVibeButton variant="secondary" fullWidth>
              Full Width Button
            </PetVibeButton>
          </PetVibeFlex>
        </PetVibeSection>

        <PetVibeDivider />

        {/* Typography */}
        <PetVibeSection>
          <PetVibeHeading size="3xl" centered>
            Typography
          </PetVibeHeading>
          <PetVibeText centered marginBottom="2xl">
            Text styles and hierarchy
          </PetVibeText>

          <PetVibeCard>
            <PetVibeHeading size="6xl" gradient>
              Gradient Heading
            </PetVibeHeading>
            <PetVibeSpacer size="lg" />
            
            <PetVibeHeading size="5xl">Heading 1</PetVibeHeading>
            <PetVibeHeading size="4xl">Heading 2</PetVibeHeading>
            <PetVibeHeading size="3xl">Heading 3</PetVibeHeading>
            <PetVibeHeading size="2xl">Heading 4</PetVibeHeading>
            <PetVibeHeading size="xl">Heading 5</PetVibeHeading>
            <PetVibeHeading size="lg">Heading 6</PetVibeHeading>
            
            <PetVibeSpacer size="lg" />
            
            <PetVibeText size="lg" weight="semibold">
              Large semibold text for important content
            </PetVibeText>
            <PetVibeText>
              Regular body text for general content. This is how most text will appear in the application.
            </PetVibeText>
            <PetVibeText size="sm" color="muted">
              Small muted text for secondary information
            </PetVibeText>
          </PetVibeCard>
        </PetVibeSection>

        <PetVibeDivider />

        {/* Form Elements */}
        <PetVibeSection>
          <PetVibeHeading size="3xl" centered>
            Form Elements
          </PetVibeHeading>
          <PetVibeText centered marginBottom="2xl">
            Input fields and form components
          </PetVibeText>

          <PetVibeCard>
            <PetVibeFlex direction="column" gap="lg">
              <div>
                <PetVibeText weight="semibold" marginBottom="sm">
                  Email Address
                </PetVibeText>
                <PetVibeInput 
                  type="email" 
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <PetVibeText weight="semibold" marginBottom="sm">
                  Password
                </PetVibeText>
                <PetVibeInput 
                  type="password" 
                  placeholder="Enter your password"
                />
              </div>
              
              <div>
                <PetVibeText weight="semibold" marginBottom="sm">
                  Message
                </PetVibeText>
                <textarea 
                  className="pv-input"
                  rows="4"
                  placeholder="Enter your message here..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              
              <PetVibeButton variant="primary" fullWidth>
                Submit Form
              </PetVibeButton>
            </PetVibeFlex>
          </PetVibeCard>
        </PetVibeSection>

        <PetVibeDivider />

        {/* Cards */}
        <PetVibeSection>
          <PetVibeHeading size="3xl" centered>
            Card Components
          </PetVibeHeading>
          <PetVibeText centered marginBottom="2xl">
            Different card styles and layouts
          </PetVibeText>

          <PetVibeGrid cols={3} gap="lg">
            <PetVibeCard hoverable>
              <PetVibeHeading size="lg">Basic Card</PetVibeHeading>
              <PetVibeText>
                This is a basic card with hover effects and proper spacing.
              </PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable elevated>
              <PetVibeHeading size="lg">Elevated Card</PetVibeHeading>
              <PetVibeText>
                This card has enhanced shadow for more prominence.
              </PetVibeText>
            </PetVibeCard>

            <PetVibeCard hoverable>
              <div className="w-full h-32 bg-pv-gradient-warm-glow rounded-lg mb-4"></div>
              <PetVibeHeading size="lg">Card with Image</PetVibeHeading>
              <PetVibeText>
                Cards can include images or other visual elements.
              </PetVibeText>
            </PetVibeCard>
          </PetVibeGrid>
        </PetVibeSection>

        <PetVibeSpacer size="2xl" />
      </PetVibeContainer>
    </div>
  );
};

export default ThemeDemo;
