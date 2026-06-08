export interface CulinaryFile {
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
  
  export interface Culinary {
    id: string
    name: string
    address: string
    latitude: string
    longitude: string
    culinaryFiles: CulinaryFile[]
  }
  
  export interface CulinaryResponse {
    status: {
      code: number
      message: string
    }
    data: {
      currentPage: number
      data: Culinary[]
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
  
  // Cache untuk menyimpan data culinaries
  let culinaryCache: Culinary[] = []
  let cacheTimestamp: number = 0
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  
  export async function getCulinaries(page: number = 1): Promise<CulinaryResponse> {
    console.log('🔄 getCulinaries called with page:', page)
    
    try {
      // ✅ PERBAIKAN: Hilangkan spasi di URL
      const url = `https://tourism.surabaya.go.id/api/kominfo/culinary?page=${page}`
      console.log('📡 Fetching from URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📥 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Data received:', {
        statusCode: data?. status?.code,
        statusMessage: data?.status?.message,
        culinaryCount: data?.data?.data?.length,
        hasData: !!data?.data?.data
      })
      
      // Update cache
      if (data?.data?.data) {
        culinaryCache = data. data.data
        cacheTimestamp = Date.now()
        console.log('💾 Cache updated with', culinaryCache.length, 'culinaries')
      }
      
      return data
    } catch (error) {
      console. error('❌ Error fetching culinaries:', error)
      
      // Jika ada cache dan masih valid, gunakan cache
      if (culinaryCache.length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Using cached culinaries data:', culinaryCache. length, 'culinaries')
        return {
          status: { code: 200, message: 'Data from cache' },
          data: {
            currentPage: page,
            data: culinaryCache,
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
            total: culinaryCache.length,
          }
        }
      }
      
      throw error
    }
  }
  
  // ✅ Function untuk fetch semua culinaries dari semua pages
  export async function getAllCulinaries(): Promise<Culinary[]> {
    console.log('🔄 getAllCulinaries: Fetching all pages...')
    
    try {
      // Cek cache dulu
      const now = Date.now()
      if (culinaryCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Using cached culinaries:', culinaryCache.length)
        return culinaryCache
      }
  
      // Fetch page 1 untuk tahu total pages
      const firstPage = await getCulinaries(1)
      const totalPages = firstPage.data.lastPage
      
      console.log(`📊 Total pages: ${totalPages}`)
      
      // Jika hanya 1 page, return langsung
      if (totalPages === 1) {
        culinaryCache = firstPage.data. data
        cacheTimestamp = Date.now()
        return firstPage.data.data
      }
      
      // Fetch semua pages secara parallel
      const pagePromises = []
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(getCulinaries(page))
      }
      
      const allPages = await Promise.all(pagePromises)
      
      // Combine semua data
      const allCulinaries = [
        ...firstPage.data.data,
        ...allPages.flatMap(pageData => pageData.data. data)
      ]
      
      console.log(`✅ Total culinaries fetched: ${allCulinaries.length}`)
      
      // Update cache
      culinaryCache = allCulinaries
      cacheTimestamp = Date.now()
      
      return allCulinaries
    } catch (error) {
      console.error('❌ Error fetching all culinaries:', error)
      
      // Fallback to cache if available
      if (culinaryCache. length > 0) {
        console.log('💾 Using expired cache as fallback:', culinaryCache.length)
        return culinaryCache
      }
      
      throw error
    }
  }
  
  export async function getCulinaryDetail(id: string): Promise<{ status: { code: number, message: string }, data: Culinary }> {
    try {
      console.log('🔍 Fetching culinary detail for ID:', id)
      
      // Cek cache dulu
      const now = Date. now()
      if (culinaryCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Checking cache for culinary:', id)
        const cachedCulinary = culinaryCache.find(c => c.id === id)
        if (cachedCulinary) {
          console. log('✅ Found in cache:', cachedCulinary. name)
          return {
            status: { code: 200, message: 'Data from cache' },
            data: cachedCulinary
          }
        }
      }
      
      // Fetch all culinaries and find by ID
      console.log('📡 Fetching all culinaries.. .')
      const allCulinaries = await getAllCulinaries()
      
      const culinary = allCulinaries.find(c => c.id === id)
      console.log('🔍 Found culinary:', culinary ?  'Yes' : 'No')
      
      if (!culinary) {
        throw new Error(`Kuliner dengan ID ${id} tidak ditemukan`)
      }
      
      return {
        status: { code: 200, message: 'Success' },
        data: culinary
      }
    } catch (error) {
      console.error('❌ Error fetching culinary detail:', error)
      
      // Last resort: cek cache meskipun expired
      if (culinaryCache.length > 0) {
        console.log('💾 Checking expired cache as fallback')
        const cachedCulinary = culinaryCache.find(c => c.id === id)
        if (cachedCulinary) {
          console.log('✅ Found in expired cache:', cachedCulinary. name)
          return {
            status: { code: 200, message: 'Data from expired cache' },
            data: cachedCulinary
          }
        }
      }
      
      throw error
    }
  }
  
  // Helper function to get thumbnail
  export function getCulinaryThumbnail(culinary: Culinary): string {
    const thumbnail = culinary.culinaryFiles.find(
      file => file.fileType === 'thumbnail'
    )
    return thumbnail?.link || '/images/placeholder-culinary.jpg'
  }
  
  // Helper function to get all gallery images
  export function getCulinaryGallery(culinary: Culinary): CulinaryFile[] {
    return culinary.culinaryFiles.filter(
      file => file.fileType === 'gallery'
    )
  }