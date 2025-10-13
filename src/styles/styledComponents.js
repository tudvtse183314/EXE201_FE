import styled from 'styled-components';
import { PetVibeTheme } from './theme';

// PetVibe Button Component
export const PetVibeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => PetVibeTheme.spacing[props.size] || PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg};
  border: none;
  border-radius: ${PetVibeTheme.borderRadius.lg};
  font-family: ${PetVibeTheme.typography.fontFamily.sans.join(', ')};
  font-size: ${props => PetVibeTheme.typography.fontSize[props.fontSize] || PetVibeTheme.typography.fontSize.base};
  font-weight: ${PetVibeTheme.typography.fontWeight.semibold};
  text-decoration: none;
  cursor: pointer;
  transition: all ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease};
  box-shadow: ${PetVibeTheme.shadows.warm};
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${PetVibeTheme.gradients.primaryButton};
          color: ${PetVibeTheme.colors.white};
        `;
      case 'secondary':
        return `
          background: ${PetVibeTheme.gradients.secondaryButton};
          color: ${PetVibeTheme.colors.white};
        `;
      case 'accent':
        return `
          background: ${PetVibeTheme.gradients.accentButton};
          color: ${PetVibeTheme.colors.white};
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${PetVibeTheme.colors.primary};
          border: 2px solid ${PetVibeTheme.colors.primary};
          box-shadow: none;
        `;
      default:
        return `
          background: ${PetVibeTheme.gradients.primaryButton};
          color: ${PetVibeTheme.colors.white};
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${PetVibeTheme.shadows.glow};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  ${props => props.rounded && `
    border-radius: ${PetVibeTheme.borderRadius.full};
  `}
`;

// PetVibe Card Component
export const PetVibeCard = styled.div`
  background: ${PetVibeTheme.colors.white};
  border-radius: ${PetVibeTheme.borderRadius.xl};
  padding: ${props => PetVibeTheme.spacing[props.padding] || PetVibeTheme.spacing.lg};
  box-shadow: ${PetVibeTheme.shadows.lg};
  border: 1px solid rgba(246, 166, 35, 0.1);
  transition: all ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease};
  
  ${props => props.hoverable && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${PetVibeTheme.shadows.glow};
    }
  `}
  
  ${props => props.elevated && `
    box-shadow: ${PetVibeTheme.shadows.xl};
  `}
`;

// PetVibe Input Component
export const PetVibeInput = styled.input`
  width: 100%;
  padding: ${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg};
  border: 2px solid ${PetVibeTheme.colors.gray[300]};
  border-radius: ${PetVibeTheme.borderRadius.lg};
  font-family: ${PetVibeTheme.typography.fontFamily.sans.join(', ')};
  font-size: ${PetVibeTheme.typography.fontSize.base};
  transition: border-color ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease};
  
  &:focus {
    outline: none;
    border-color: ${PetVibeTheme.colors.primary};
    box-shadow: 0 0 0 3px rgba(246, 166, 35, 0.1);
  }
  
  &::placeholder {
    color: ${PetVibeTheme.colors.gray[400]};
  }
  
  &:disabled {
    background-color: ${PetVibeTheme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

// PetVibe Container Component
export const PetVibeContainer = styled.div`
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${PetVibeTheme.spacing.lg};
  
  @media (max-width: ${PetVibeTheme.breakpoints.md}) {
    padding: 0 ${PetVibeTheme.spacing.md};
  }
`;

// PetVibe Section Component
export const PetVibeSection = styled.section`
  padding: ${props => PetVibeTheme.spacing[props.padding] || PetVibeTheme.spacing['4xl']} 0;
  background: ${props => {
    switch (props.background) {
      case 'light':
        return PetVibeTheme.colors.light;
      case 'dark':
        return PetVibeTheme.colors.dark;
      case 'primary':
        return PetVibeTheme.colors.primary;
      case 'gradient':
        return PetVibeTheme.gradients.warmBackground;
      default:
        return 'transparent';
    }
  }};
  
  ${props => props.centered && `
    text-align: center;
  `}
`;

// PetVibe Heading Component
export const PetVibeHeading = styled.h1`
  font-family: ${PetVibeTheme.typography.fontFamily.sans.join(', ')};
  font-weight: ${PetVibeTheme.typography.fontWeight.bold};
  color: ${props => {
    switch (props.color) {
      case 'primary':
        return PetVibeTheme.colors.primary;
      case 'secondary':
        return PetVibeTheme.colors.secondary;
      case 'dark':
        return PetVibeTheme.colors.dark;
      case 'white':
        return PetVibeTheme.colors.white;
      default:
        return PetVibeTheme.text.heading;
    }
  }};
  margin-bottom: ${props => PetVibeTheme.spacing[props.marginBottom] || PetVibeTheme.spacing.lg};
  
  ${props => {
    switch (props.size) {
      case 'xs':
        return `font-size: ${PetVibeTheme.typography.fontSize.xs};`;
      case 'sm':
        return `font-size: ${PetVibeTheme.typography.fontSize.sm};`;
      case 'base':
        return `font-size: ${PetVibeTheme.typography.fontSize.base};`;
      case 'lg':
        return `font-size: ${PetVibeTheme.typography.fontSize.lg};`;
      case 'xl':
        return `font-size: ${PetVibeTheme.typography.fontSize.xl};`;
      case '2xl':
        return `font-size: ${PetVibeTheme.typography.fontSize['2xl']};`;
      case '3xl':
        return `font-size: ${PetVibeTheme.typography.fontSize['3xl']};`;
      case '4xl':
        return `font-size: ${PetVibeTheme.typography.fontSize['4xl']};`;
      case '5xl':
        return `font-size: ${PetVibeTheme.typography.fontSize['5xl']};`;
      case '6xl':
        return `font-size: ${PetVibeTheme.typography.fontSize['6xl']};`;
      case '7xl':
        return `font-size: ${PetVibeTheme.typography.fontSize['7xl']};`;
      default:
        return `font-size: ${PetVibeTheme.typography.fontSize['4xl']};`;
    }
  }}
  
  ${props => props.gradient && `
    background: ${PetVibeTheme.gradients.warmGlow};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
`;

// PetVibe Text Component
export const PetVibeText = styled.p`
  font-family: ${PetVibeTheme.typography.fontFamily.sans.join(', ')};
  font-size: ${props => PetVibeTheme.typography.fontSize[props.size] || PetVibeTheme.typography.fontSize.base};
  font-weight: ${props => PetVibeTheme.typography.fontWeight[props.weight] || PetVibeTheme.typography.fontWeight.normal};
  color: ${props => {
    switch (props.color) {
      case 'primary':
        return PetVibeTheme.colors.primary;
      case 'secondary':
        return PetVibeTheme.colors.secondary;
      case 'muted':
        return PetVibeTheme.text.muted;
      case 'white':
        return PetVibeTheme.colors.white;
      default:
        return PetVibeTheme.text.body;
    }
  }};
  line-height: ${props => PetVibeTheme.typography.lineHeight[props.lineHeight] || PetVibeTheme.typography.lineHeight.normal};
  margin-bottom: ${props => PetVibeTheme.spacing[props.marginBottom] || '0'};
  
  ${props => props.centered && `
    text-align: center;
  `}
`;

// PetVibe Flex Component
export const PetVibeFlex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => PetVibeTheme.spacing[props.gap] || '0'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  ${props => props.centered && `
    align-items: center;
    justify-content: center;
  `}
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  ${props => props.fullHeight && `
    height: 100%;
  `}
`;

// PetVibe Grid Component
export const PetVibeGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => {
    if (props.cols) {
      return `repeat(${props.cols}, 1fr)`;
    }
    if (props.responsive) {
      return 'repeat(auto-fit, minmax(300px, 1fr))';
    }
    return 'repeat(auto-fit, minmax(250px, 1fr))';
  }};
  gap: ${props => PetVibeTheme.spacing[props.gap] || PetVibeTheme.spacing.lg};
  
  @media (max-width: ${PetVibeTheme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// PetVibe Spacer Component
export const PetVibeSpacer = styled.div`
  height: ${props => PetVibeTheme.spacing[props.size] || PetVibeTheme.spacing.lg};
`;

// PetVibe Divider Component
export const PetVibeDivider = styled.hr`
  border: none;
  height: 1px;
  background: ${PetVibeTheme.colors.gray[200]};
  margin: ${props => PetVibeTheme.spacing[props.margin] || PetVibeTheme.spacing.lg} 0;
  
  ${props => props.gradient && `
    background: ${PetVibeTheme.gradients.warmGlow};
    height: 2px;
  `}
`;

// Export all components
export default {
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
  PetVibeDivider,
};
