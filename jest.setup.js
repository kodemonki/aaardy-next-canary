import '@testing-library/jest-dom'

import React from 'react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    searchParams: new URLSearchParams()
  }),
  useSearchParams: () => new URLSearchParams()
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props) {
    return React.createElement('img', props)
  },
}))

// Setup fetch mock for tests
global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})