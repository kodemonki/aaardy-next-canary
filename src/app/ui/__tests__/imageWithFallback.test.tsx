import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import ImageWithFallback from '@/app/ui/imageWithFallback'

describe('ImageWithFallback', () => {
  const defaultProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test Bean jelly bean',
    width: 64,
    height: 64,
    className: 'object-cover rounded-lg',
    fallbackColor: '#FF0000',
  }

  it('should render image with correct props', () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const image = screen.getByAltText('Test Bean jelly bean')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg')
    expect(image).toHaveAttribute('width', '64')
    expect(image).toHaveAttribute('height', '64')
  })

  it('should show loading spinner initially', () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const loadingSpinner = document.querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
  })

  it('should hide loading spinner when image loads', async () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const image = screen.getByAltText('Test Bean jelly bean')
    
    // Simulate image load event
    Object.defineProperty(image, 'complete', {
      writable: true,
      value: true,
    })
    
    // Trigger onLoad
    const onLoadEvent = new Event('load')
    act(() => {
      image.dispatchEvent(onLoadEvent)
    })
    
    await waitFor(() => {
      const loadingSpinner = document.querySelector('.animate-spin')
      expect(loadingSpinner).not.toBeInTheDocument()
    })
  })

  it('should show fallback when image fails to load', async () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const image = screen.getByAltText('Test Bean jelly bean')
    
    // Simulate image error event
    const onErrorEvent = new Event('error')
    act(() => {
      image.dispatchEvent(onErrorEvent)
    })
    
    await waitFor(() => {
      expect(image).not.toBeInTheDocument()
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })

  it('should display fallback with correct background color', async () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const image = screen.getByAltText('Test Bean jelly bean')
    
    // Simulate image error event
    const onErrorEvent = new Event('error')
    act(() => {
      image.dispatchEvent(onErrorEvent)
    })
    
    await waitFor(() => {
      const fallback = screen.getByText('Test').parentElement
      expect(fallback).toHaveStyle('background-color: rgb(255, 0, 0)')
    })
  })

  it('should display first word of alt text in fallback', async () => {
    const propsWithLongAlt = {
      ...defaultProps,
      alt: 'Strawberry Cheesecake Flavor jelly bean',
    }
    
    render(<ImageWithFallback {...propsWithLongAlt} />)
    
    const image = screen.getByAltText('Strawberry Cheesecake Flavor jelly bean')
    
    // Simulate image error event
    const onErrorEvent = new Event('error')
    act(() => {
      image.dispatchEvent(onErrorEvent)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Strawberry')).toBeInTheDocument()
    })
  })

  it('should apply correct dimensions to fallback', async () => {
    const propsWithDifferentSize = {
      ...defaultProps,
      width: 100,
      height: 80,
    }
    
    render(<ImageWithFallback {...propsWithDifferentSize} />)
    
    const image = screen.getByAltText('Test Bean jelly bean')
    
    // Simulate image error event
    const onErrorEvent = new Event('error')
    act(() => {
      image.dispatchEvent(onErrorEvent)
    })
    
    await waitFor(() => {
      const fallback = screen.getByText('Test').parentElement
      expect(fallback).toHaveStyle('width: 100px')
      expect(fallback).toHaveStyle('height: 80px')
    })
  })

  it('should include className in image element', () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const image = screen.getByAltText('Test Bean jelly bean')
    expect(image).toHaveClass('object-cover', 'rounded-lg')
  })

  it('should handle empty alt text gracefully', async () => {
    const propsWithEmptyAlt = {
      ...defaultProps,
      alt: '',
    }
    
    render(<ImageWithFallback {...propsWithEmptyAlt} />)
    
    const image = screen.getByRole('presentation')
    
    // Simulate image error event
    const onErrorEvent = new Event('error')
    act(() => {
      image.dispatchEvent(onErrorEvent)
    })
    
    await waitFor(() => {
      // Should not crash and should show empty text
      const fallback = document.querySelector('[style*="background-color"]')
      expect(fallback).toBeInTheDocument()
    })
  })
})