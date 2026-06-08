export interface TourismCategory {
    id: number
    name: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    createdBy: number
    updatedBy: number
    deletedBy: number | null
    idHash: string
    pivot?: {
      touristDestinationId: number
      tourismCategoryId: number
      createdAt: string
      updatedAt: string
      id: number
      deletedAt: string | null
    }
  }
  
  export interface DestinationFile {
    id: string
    name: string
    path: string
    size: string
    ext: string
    fileType: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    createdBy: number
    updatedBy: number
    deletedBy: number | null
    link: string
    fileTypeName: string
  }
  
  export interface Destination {
    id: string
    address: string
    latitude: string
    longitude: string
    nameIndonesia: string
    nameInggris: string | null
    descriptionIndonesia: string
    desctiptionInggris: string | null
    tourismCategory: TourismCategory[]
    touristDestinationFiles: DestinationFile[]
  }
  
  export interface DestinationResponse {
    status: {
      code: number
      message: string
    }
    data: {
      currentPage: number
      data: Destination[]
      firstPageUrl: string
      from: number
      lastPage: number
      lastPageUrl: string
      links: Array<{
        url: string | null
        label: string
        active: boolean
      }>
      nextPageUrl: string | null
      path: string
      perPage: number
      prevPageUrl: string | null
      to: number
      total: number
    }
  }
  
  // Cache untuk menyimpan data destinations
  let destinationsCache: Destination[] = []
  let cacheTimestamp: number = 0
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  
  export async function getDestinations(page: number = 1): Promise<DestinationResponse> {
    console.log('🔄 getDestinations called with page:', page)
    
    try {
      const url = `https://tourism.surabaya.go.id/api/kominfo/destination?page=${page}`
      console.log('📡 Fetching from URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📥 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP error!  status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Data received:', {
        statusCode: data?. status?.code,
        statusMessage: data?.status?.message,
        destinationsCount: data?.data?.data?.length,
        hasData: !!data?.data?.data
      })
      
      return data
    } catch (error) {
      console.error('❌ Error fetching destinations:', error)
      throw error
    }
  }
  
  // ✅ NEW: Function untuk fetch semua destinations dari semua pages
  export async function getAllDestinations(): Promise<Destination[]> {
    console.log('🔄 getAllDestinations: Fetching all pages...')
    
    try {
      // Cek cache dulu
      const now = Date.now()
      if (destinationsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Using cached destinations:', destinationsCache. length)
        return destinationsCache
      }
  
      // Fetch page 1 untuk tahu total pages
      const firstPage = await getDestinations(1)
      const totalPages = firstPage.data.lastPage
      
      console.log(`📊 Total pages: ${totalPages}`)
      
      // Jika hanya 1 page, return langsung
      if (totalPages === 1) {
        destinationsCache = firstPage.data. data
        cacheTimestamp = Date.now()
        return firstPage.data.data
      }
      
      // Fetch semua pages secara parallel
      const pagePromises = []
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(getDestinations(page))
      }
      
      const allPages = await Promise.all(pagePromises)
      
      // Combine semua data
      const allDestinations = [
        ...firstPage.data. data,
        ...allPages. flatMap(pageData => pageData.data. data)
      ]
      
      console.log(`✅ Total destinations fetched: ${allDestinations.length}`)
      
      // Update cache
      destinationsCache = allDestinations
      cacheTimestamp = Date.now()
      
      return allDestinations
    } catch (error) {
      console.error('❌ Error fetching all destinations:', error)
      
      // Fallback to cache if available
      if (destinationsCache. length > 0) {
        console.log('💾 Using expired cache as fallback:', destinationsCache.length)
        return destinationsCache
      }
      
      throw error
    }
  }
  
  export async function getDestinationDetail(id: string): Promise<{ status: { code: number, message: string }, data: Destination }> {
    try {
      console.log('🔍 Fetching destination detail for ID:', id)
      
      // Cek cache dulu
      const now = Date. now()
      if (destinationsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Checking cache for destination:', id)
        const cachedDestination = destinationsCache.find(d => d.id === id)
        if (cachedDestination) {
          console.log('✅ Found in cache:', cachedDestination.nameIndonesia)
          return {
            status: { code: 200, message: 'Data from cache' },
            data: cachedDestination
          }
        }
      }
      
      // Fetch all destinations and find by ID
      console.log('📡 Fetching all destinations...')
      const allDestinations = await getAllDestinations()
      
      const destination = allDestinations.find(d => d.id === id)
      console.log('🔍 Found destination:', destination ?  'Yes' : 'No')
      
      if (!destination) {
        throw new Error(`Destination with ID ${id} not found`)
      }
      
      return {
        status: { code: 200, message: 'Success' },
        data: destination
      }
    } catch (error) {
      console.error('❌ Error fetching destination detail:', error)
      
      // Last resort: cek cache meskipun expired
      if (destinationsCache. length > 0) {
        console.log('💾 Checking expired cache as fallback')
        const cachedDestination = destinationsCache.find(d => d.id === id)
        if (cachedDestination) {
          console.log('✅ Found in expired cache:', cachedDestination.nameIndonesia)
          return {
            status: { code: 200, message: 'Data from expired cache' },
            data: cachedDestination
          }
        }
      }
      
      throw error
    }
  }
  
  // Helper function to get thumbnail from files
  export function getDestinationThumbnail(destination: Destination): string {
    const thumbnail = destination.touristDestinationFiles.find(
      file => file.fileType === 'thumbnail'
    )
    return thumbnail?.link || '/images/placeholder-destination. jpg'
  }
  
  // Helper function to get all gallery images
  export function getDestinationGallery(destination: Destination): DestinationFile[] {
    return destination.touristDestinationFiles.filter(
      file => file.fileType === 'gallery'
    )
  }
  
  // Helper function to get category names
  export function getDestinationCategories(destination: Destination): string[] {
    return destination.tourismCategory.map(cat => cat.name)
  }