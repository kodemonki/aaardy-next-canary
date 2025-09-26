import { BeanData } from '@/app/actions'

// Test utilities for bean filtering, sorting, and pagination logic
describe('Bean Utils', () => {
  const mockBeans: BeanData[] = [
    {
      beanId: 1,
      groupName: ['Jelly Belly Official Flavors', 'Kids Mix Flavors'],
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
      flavorName: 'Apple',
      description: 'Crisp apple taste',
      colorGroup: 'green',
      backgroundColor: '#00FF00',
      imageUrl: 'https://example.com/apple.jpg',
      glutenFree: true,
      sugarFree: false,
      seasonal: false,
      kosher: true,
    },
    {
      beanId: 3,
      groupName: ['Soda Pop Shoppe® Flavors'],
      ingredients: ['Artificial Flavors'],
      flavorName: 'Cola',
      description: 'Classic cola flavor',
      colorGroup: 'brown',
      backgroundColor: '#8B4513',
      imageUrl: 'https://example.com/cola.jpg',
      glutenFree: false,
      sugarFree: true,
      seasonal: false,
      kosher: false,
    },
    {
      beanId: 4,
      groupName: ['Jelly Belly Official Flavors'],
      ingredients: ['Sugar', 'Vanilla'],
      flavorName: 'Banana',
      description: 'Tropical banana flavor',
      colorGroup: 'yellow',
      backgroundColor: '#FFFF00',
      imageUrl: 'https://example.com/banana.jpg',
      glutenFree: false,
      sugarFree: false,
      seasonal: true,
      kosher: true,
    },
  ]

  describe('Filtering Logic', () => {
    const filterBeans = (beans: BeanData[], filterBy?: string) => {
      if (!filterBy || filterBy === '') {
        return beans
      }
      return beans.filter(bean => 
        bean.groupName.some(group => 
          group.toLowerCase().includes(filterBy.toLowerCase())
        )
      )
    }

    it('should return all beans when no filter is applied', () => {
      const result = filterBeans(mockBeans)
      expect(result).toEqual(mockBeans)
    })

    it('should return all beans when filter is empty string', () => {
      const result = filterBeans(mockBeans, '')
      expect(result).toEqual(mockBeans)
    })

    it('should filter beans by exact group name match', () => {
      const result = filterBeans(mockBeans, 'Kids Mix Flavors')
      expect(result).toHaveLength(2)
      expect(result[0].flavorName).toBe('Cherry')
      expect(result[1].flavorName).toBe('Apple')
    })

    it('should filter beans by partial group name match', () => {
      const result = filterBeans(mockBeans, 'Soda Pop')
      expect(result).toHaveLength(1)
      expect(result[0].flavorName).toBe('Cola')
    })

    it('should be case insensitive', () => {
      const result = filterBeans(mockBeans, 'KIDS MIX')
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no matches found', () => {
      const result = filterBeans(mockBeans, 'Non-existent Group')
      expect(result).toHaveLength(0)
    })
  })

  describe('Sorting Logic', () => {
    const sortBeans = (beans: BeanData[], sortBy?: string) => {
      if (!sortBy || sortBy === '') {
        return beans
      }

      return [...beans].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.flavorName.localeCompare(b.flavorName)
          case 'flavor group':
            return a.groupName[0]?.localeCompare(b.groupName[0] || '') || 0
          case 'sugar-free status':
            return b.sugarFree === a.sugarFree ? 0 : b.sugarFree ? 1 : -1
          default:
            return 0
        }
      })
    }

    it('should return original order when no sort is applied', () => {
      const result = sortBeans(mockBeans)
      expect(result).toEqual(mockBeans)
    })

    it('should sort by name alphabetically', () => {
      const result = sortBeans(mockBeans, 'name')
      const names = result.map(bean => bean.flavorName)
      expect(names).toEqual(['Apple', 'Banana', 'Cherry', 'Cola'])
    })

    it('should sort by flavor group', () => {
      const result = sortBeans(mockBeans, 'flavor group')
      const groups = result.map(bean => bean.groupName[0])
      expect(groups).toEqual([
        'Jelly Belly Official Flavors',
        'Jelly Belly Official Flavors', 
        'Kids Mix Flavors',
        'Soda Pop Shoppe® Flavors'
      ])
    })

    it('should sort by sugar-free status (sugar-free first)', () => {
      const result = sortBeans(mockBeans, 'sugar-free status')
      expect(result[0].sugarFree).toBe(true)
      expect(result[0].flavorName).toBe('Cola')
    })

    it('should not mutate original array', () => {
      const original = [...mockBeans]
      sortBeans(mockBeans, 'name')
      expect(mockBeans).toEqual(original)
    })
  })

  describe('Pagination Logic', () => {
    const getPaginationInfo = (beans: BeanData[], page: number, beansPerPage = 6) => {
      const totalPages = Math.ceil(beans.length / beansPerPage)
      const currentPage = Math.max(1, Math.min(page, totalPages))
      const startIndex = (currentPage - 1) * beansPerPage
      const endIndex = startIndex + beansPerPage
      
      return {
        displayBeans: beans.slice(startIndex, endIndex),
        totalPages,
        currentPage,
        startIndex,
        endIndex: Math.min(endIndex, beans.length),
        totalCount: beans.length
      }
    }

    it('should return correct pagination for first page', () => {
      const result = getPaginationInfo(mockBeans, 1, 2)
      
      expect(result.currentPage).toBe(1)
      expect(result.totalPages).toBe(2)
      expect(result.displayBeans).toHaveLength(2)
      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBe(2)
    })

    it('should return correct pagination for last page', () => {
      const result = getPaginationInfo(mockBeans, 2, 3)
      
      expect(result.currentPage).toBe(2)
      expect(result.displayBeans).toHaveLength(1)
      expect(result.startIndex).toBe(3)
      expect(result.endIndex).toBe(4)
    })

    it('should handle page number too high', () => {
      const result = getPaginationInfo(mockBeans, 10, 2)
      
      expect(result.currentPage).toBe(2) // Should clamp to max page
      expect(result.totalPages).toBe(2)
    })

    it('should handle page number too low', () => {
      const result = getPaginationInfo(mockBeans, 0, 2)
      
      expect(result.currentPage).toBe(1) // Should clamp to min page
    })

    it('should handle negative page number', () => {
      const result = getPaginationInfo(mockBeans, -5, 2)
      
      expect(result.currentPage).toBe(1)
    })

    it('should calculate total pages correctly', () => {
      expect(getPaginationInfo(mockBeans, 1, 2).totalPages).toBe(2)
      expect(getPaginationInfo(mockBeans, 1, 3).totalPages).toBe(2)
      expect(getPaginationInfo(mockBeans, 1, 4).totalPages).toBe(1)
      expect(getPaginationInfo(mockBeans, 1, 10).totalPages).toBe(1)
    })

    it('should handle empty bean array', () => {
      const result = getPaginationInfo([], 1, 6)
      
      expect(result.displayBeans).toHaveLength(0)
      expect(result.totalPages).toBe(0)
      expect(result.currentPage).toBe(1)
    })

    it('should return correct total count', () => {
      const result = getPaginationInfo(mockBeans, 1, 6)
      expect(result.totalCount).toBe(4)
    })
  })

  describe('Combined Operations', () => {
    it('should filter then sort then paginate correctly', () => {
      // Filter for Kids Mix
      const filtered = mockBeans.filter(bean => 
        bean.groupName.some(group => 
          group.toLowerCase().includes('kids mix')
        )
      )
      
      // Sort by name
      const sorted = [...filtered].sort((a, b) => 
        a.flavorName.localeCompare(b.flavorName)
      )
      
      // Paginate (page 1, 1 per page)
      const paginated = sorted.slice(0, 1)
      
      expect(filtered).toHaveLength(2)
      expect(sorted[0].flavorName).toBe('Apple')
      expect(sorted[1].flavorName).toBe('Cherry')
      expect(paginated).toHaveLength(1)
      expect(paginated[0].flavorName).toBe('Apple')
    })
  })
})