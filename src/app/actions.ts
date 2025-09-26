"use server";

export interface BeanData {
  beanId: number;
  groupName: string[];
  ingredients: string[];
  flavorName: string;
  description: string;
  colorGroup: string;
  backgroundColor: string;
  imageUrl: string;
  glutenFree: boolean;
  sugarFree: boolean;
  seasonal: boolean;
  kosher: boolean;
}

export interface BeansResponse {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  items: BeanData[];
}

export async function fetchBeanData(): Promise<BeansResponse> {
  try {
    const response = await fetch('https://jellybellywikiapi.onrender.com/api/Beans?pageIndex=1&pageSize=200', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch beans:', error);
    throw new Error('Unable to load bean data. Please try again later.');
  }
}
