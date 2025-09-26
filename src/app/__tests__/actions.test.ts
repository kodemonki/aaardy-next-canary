import { fetchBeanData } from '@/app/actions'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Server Actions', () => {
  describe('fetchBeanData', () => {
    const mockBeansResponse = {
      totalCount: 100,
      pageSize: 200,
      currentPage: 1,
      totalPages: 1,
      items: [
        {
          beanId: 1,
          groupName: ['Jelly Belly Official Flavors'],
          ingredients: ['Sugar', 'Corn Syrup'],
          flavorName: 'Cherry',
          description: 'Sweet cherry flavor',
          colorGroup: 'red',
          backgroundColor: '#FF0000',
          imageUrl: 'https://example.com/cherry.jpg',
          glutenFree: false,
          sugarFree: false,
          seasonal: false,
          kosher: true,
        },
        {
          beanId: 2,
          groupName: ['Kids Mix Flavors'],
          ingredients: ['Sugar', 'Natural Flavors'],
          flavorName: 'Bubble Gum',
          description: 'Classic bubble gum taste',
          colorGroup: 'pink',
          backgroundColor: '#FFC0CB',
          imageUrl: 'https://example.com/bubblegum.jpg',
          glutenFree: true,
          sugarFree: false,
          seasonal: false,
          kosher: true,
        },
      ],
    }

    beforeEach(() => {
      mockFetch.mockClear()
    })

    it('should fetch bean data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBeansResponse,
      } as Response)

      const result = await fetchBeanData()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://jellybellywikiapi.onrender.com/api/Beans?pageIndex=1&pageSize=200',
        {
          next: { revalidate: 3600 }
        }
      )
      expect(result).toEqual(mockBeansResponse)
    })

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchBeanData()).rejects.toThrow(
        'Unable to load bean data. Please try again later.'
      )
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchBeanData()).rejects.toThrow(
        'Unable to load bean data. Please try again later.'
      )
    })

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      } as Response)

      await expect(fetchBeanData()).rejects.toThrow(
        'Unable to load bean data. Please try again later.'
      )
    })

    it('should cache requests for 1 hour', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBeansResponse,
      } as Response)

      await fetchBeanData()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 3600 }
        })
      )
    })
  })
})