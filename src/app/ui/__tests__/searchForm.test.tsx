import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchForm from '@/app/ui/searchForm'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => {
    const searchParams = new URLSearchParams()
    return {
      get: (key: string) => searchParams.get(key),
    }
  },
}))

describe('SearchForm', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('should render form with filter and sort controls', () => {
    render(<SearchForm />)
    
    expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /apply selected filters and sorting options/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('should have accessibility attributes', () => {
    render(<SearchForm />)
    
    const form = screen.getByRole('search')
    expect(form).toHaveAttribute('aria-label', 'Filter and sort jelly beans')
    
    const filterSelect = screen.getByLabelText(/filter by/i)
    expect(filterSelect).toHaveAttribute('id', 'filter-select')
    expect(filterSelect).toHaveAttribute('aria-describedby', 'filter-help')
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    expect(sortSelect).toHaveAttribute('id', 'sort-select')
    expect(sortSelect).toHaveAttribute('aria-describedby', 'sort-help')
  })

  it('should contain all filter options', () => {
    render(<SearchForm />)
    
    expect(screen.getByText('All Groups')).toBeInTheDocument()
    expect(screen.getByText('Jelly Belly Official Flavors')).toBeInTheDocument()
    expect(screen.getByText('Kids Mix Flavors')).toBeInTheDocument()
    expect(screen.getByText('Soda Pop Shoppe® Flavors')).toBeInTheDocument()
  })

  it('should contain all sort options', () => {
    render(<SearchForm />)
    
    expect(screen.getByText('Default Order')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Flavor Group')).toBeInTheDocument()
    expect(screen.getByText('Sugar-Free Status')).toBeInTheDocument()
  })

  it('should update filter selection', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const filterSelect = screen.getByLabelText(/filter by/i)
    
    await user.selectOptions(filterSelect, 'Kids Mix Flavors')
    
    expect(filterSelect).toHaveValue('Kids Mix Flavors')
  })

  it('should update sort selection', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    
    await user.selectOptions(sortSelect, 'name')
    
    expect(sortSelect).toHaveValue('name')
  })

  it('should handle form submission with selected values', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const filterSelect = screen.getByLabelText(/filter by/i)
    const sortSelect = screen.getByLabelText(/sort by/i)
    const submitButton = screen.getByRole('button', { name: /apply selected filters and sorting options/i })
    
    // Select filter and sort options
    await user.selectOptions(filterSelect, 'Jelly Belly Official Flavors')
    await user.selectOptions(sortSelect, 'name')
    
    // Submit form
    await user.click(submitButton)
    
    // Check if router.push was called with correct URL
    expect(mockPush).toHaveBeenCalledWith('/?filterBy=Jelly+Belly+Official+Flavors&sortBy=name&page=1')
  })

  it('should reset to page 1 when filters change', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const filterSelect = screen.getByLabelText(/filter by/i)
    const submitButton = screen.getByRole('button', { name: /apply selected filters and sorting options/i })
    
    await user.selectOptions(filterSelect, 'Soda Pop Shoppe® Flavors')
    await user.click(submitButton)
    
    expect(mockPush).toHaveBeenCalledWith('/?filterBy=Soda+Pop+Shoppe%C2%AE+Flavors&page=1')
  })

  it('should handle empty filters', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const submitButton = screen.getByRole('button', { name: /apply selected filters and sorting options/i })
    
    await user.click(submitButton)
    
    expect(mockPush).toHaveBeenCalledWith('/?page=1')
  })

  it('should clear all filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const filterSelect = screen.getByLabelText(/filter by/i)
    const sortSelect = screen.getByLabelText(/sort by/i)
    const clearButton = screen.getByRole('button', { name: /clear filters/i })
    
    // Select some options first
    await user.selectOptions(filterSelect, 'Jelly Belly Official Flavors')
    await user.selectOptions(sortSelect, 'name')
    
    // Click clear button
    await user.click(clearButton)
    
    // Check if selects are cleared
    expect(filterSelect).toHaveValue('')
    expect(sortSelect).toHaveValue('')
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should prevent default form submission', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const form = screen.getByRole('search')
    const submitSpy = jest.fn()
    
    form.addEventListener('submit', submitSpy)
    
    const submitButton = screen.getByRole('button', { name: /apply selected filters and sorting options/i })
    await user.click(submitButton)
    
    expect(submitSpy).toHaveBeenCalled()
    const event = submitSpy.mock.calls[0][0]
    expect(event.defaultPrevented).toBe(true)
  })

  it('should have proper focus management', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    
    const filterSelect = screen.getByLabelText(/filter by/i)
    const sortSelect = screen.getByLabelText(/sort by/i)
    const applyButton = screen.getByRole('button', { name: /apply selected filters and sorting options/i })
    
    // Tab through elements
    await user.tab()
    expect(filterSelect).toHaveFocus()
    
    await user.tab()
    expect(sortSelect).toHaveFocus()
    
    await user.tab()
    expect(applyButton).toHaveFocus()
  })

  it('should include hidden help text for screen readers', () => {
    render(<SearchForm />)
    
    expect(screen.getByText('Filter beans by flavor group')).toBeInTheDocument()
    expect(screen.getByText('Sort beans by name, flavor group, or dietary options')).toBeInTheDocument()
  })
})