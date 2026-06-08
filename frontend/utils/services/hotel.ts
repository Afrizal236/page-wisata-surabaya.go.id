export interface HotelCategory {
    id: number
    idHash: string
    starNumber: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    starNumberName: string
  }
  
  export interface HotelFile {
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
  
  export interface Hotel {
    id: string
    name: string
    address: string
    latitude: string
    longitude: string
    websiteLink: string
    phoneNumber: string
    description: string
    hotelFiles: HotelFile[]
    hotelThumbnail: HotelFile
    hotelCategory: HotelCategory
  }
  
  export interface HotelResponse {
    status: {
      code: number
      message: string
    }
    data: {
      currentPage: number
      data: Hotel[]
      firstPageUrl: string
      from: number | null
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
      to: number | null
      total: number
    }
  }
  
  // Cache untuk menyimpan data hotels
  let hotelsCache: Hotel[] = []
  let cacheTimestamp: number = 0
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  
  export async function getHotels(page: number = 1): Promise<HotelResponse> {
    console.log('🔄 getHotels called with page:', page)
    
    try {
      const url = `https://tourism.surabaya.go.id/api/kominfo/hotel?page=${page}`
      console.log('📡 Fetching from URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📥 Response status:', response.status, response.statusText)
      
      if (! response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Data received:', {
        statusCode: data?. status?.code,
        statusMessage: data?.status?.message,
        hotelsCount: data?.data?.data?.length,
        hasData: !!data?.data?.data
      })
      
      // Update cache
      if (data?.data?.data) {
        hotelsCache = data. data.data
        cacheTimestamp = Date.now()
        console.log('💾 Cache updated with', hotelsCache.length, 'hotels')
      }
      
      return data
    } catch (error) {
      console.error('❌ Error fetching hotels:', error)
      
      // Jika ada cache dan masih valid, gunakan cache
      if (hotelsCache. length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Using cached hotels data:', hotelsCache. length, 'hotels')
        return {
          status: { code: 200, message: 'Data from cache' },
          data: {
            currentPage: page,
            data: hotelsCache,
            firstPageUrl: '',
            from: null,
            lastPage: 1,
            lastPageUrl: '',
            links: [],
            nextPageUrl: null,
            path: '',
            perPage: 10,
            prevPageUrl: null,
            to: null,
            total: hotelsCache.length,
          }
        }
      }
      
      throw error
    }
  }
  
  // ✅ Function untuk fetch semua hotels dari semua pages
  export async function getAllHotels(): Promise<Hotel[]> {
    console.log('🔄 getAllHotels: Fetching all pages...')
    
    try {
      // Cek cache dulu
      const now = Date.now()
      if (hotelsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Using cached hotels:', hotelsCache.length)
        return hotelsCache
      }
  
      // Fetch page 1 untuk tahu total pages
      const firstPage = await getHotels(1)
      const totalPages = firstPage.data. lastPage
      
      console.log(`📊 Total pages: ${totalPages}`)
      
      // Jika hanya 1 page, return langsung
      if (totalPages === 1) {
        hotelsCache = firstPage.data. data
        cacheTimestamp = Date.now()
        return firstPage.data.data
      }
      
      // Fetch semua pages secara parallel
      const pagePromises = []
      for (let page = 2; page <= totalPages; page++) {
        pagePromises. push(getHotels(page))
      }
      
      const allPages = await Promise.all(pagePromises)
      
      // Combine semua data
      const allHotels = [
        ...firstPage.data.data,
        ...allPages.flatMap(pageData => pageData.data. data)
      ]
      
      console.log(`✅ Total hotels fetched: ${allHotels.length}`)
      
      // Update cache
      hotelsCache = allHotels
      cacheTimestamp = Date.now()
      
      return allHotels
    } catch (error) {
      console.error('❌ Error fetching all hotels:', error)
      
      // Fallback to cache if available
      if (hotelsCache. length > 0) {
        console.log('💾 Using expired cache as fallback:', hotelsCache.length)
        return hotelsCache
      }
      
      throw error
    }
  }
  
  export async function getHotelDetail(id: string): Promise<{ status: { code: number, message: string }, data: Hotel }> {
    try {
      console.log('🔍 Fetching hotel detail for ID:', id)
      
      // Cek cache dulu
      const now = Date.now()
      if (hotelsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Checking cache for hotel:', id)
        const cachedHotel = hotelsCache.find(h => h.id === id)
        if (cachedHotel) {
          console. log('✅ Found in cache:', cachedHotel.name)
          return {
            status: { code: 200, message: 'Data from cache' },
            data: cachedHotel
          }
        }
      }
      
      // Fetch all hotels and find by ID
      console.log('📡 Fetching all hotels...')
      const allHotels = await getAllHotels()
      
      const hotel = allHotels.find(h => h.id === id)
      console.log('🔍 Found hotel:', hotel ?  'Yes' : 'No')
      
      if (!hotel) {
        throw new Error(`Hotel with ID ${id} not found`)
      }
      
      return {
        status: { code: 200, message: 'Success' },
        data: hotel
      }
    } catch (error) {
      console.error('❌ Error fetching hotel detail:', error)
      
      // Last resort: cek cache meskipun expired
      if (hotelsCache. length > 0) {
        console.log('💾 Checking expired cache as fallback')
        const cachedHotel = hotelsCache.find(h => h.id === id)
        if (cachedHotel) {
          console.log('✅ Found in expired cache:', cachedHotel.name)
          return {
            status: { code: 200, message: 'Data from expired cache' },
            data: cachedHotel
          }
        }
      }
      
      throw error
    }
  }
  
  // Helper function to get thumbnail
  export function getHotelThumbnail(hotel: Hotel): string {
    return hotel.hotelThumbnail?. link || '/images/placeholder-hotel.jpg'
  }
  
  // Helper function to get all gallery images
  export function getHotelGallery(hotel: Hotel): HotelFile[] {
    return hotel.hotelFiles. filter(
      file => file.fileType === 'gallery'
    )
  }
  
  // Helper function to get star rating
  export function getHotelStarRating(hotel: Hotel): number {
    return hotel.hotelCategory?. starNumber || 0
  }