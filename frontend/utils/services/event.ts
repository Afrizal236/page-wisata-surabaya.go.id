export interface Event {
    id: string
    organizer: string
    address: string
    latitude: string
    longitude: string
    startDate: string
    endDate: string
    nameIndonesia: string
    nameInggris: string | null
    descriptionIndonesia: string
    desctiptionInggris: string | null
    eventThumbnail: string
    idKategoriEvent: string
    linkDetailEvent: string
  }
  
  export interface EventResponse {
    status: {
      code: number
      message: string
    }
    data: {
      currentPage: number
      data: Event[]
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
  
  // Cache untuk menyimpan data events
  let eventsCache: Event[] = []
  let cacheTimestamp: number = 0
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  
  export async function getEvents(page: number = 1): Promise<EventResponse> {
    console.log('🔄 getEvents called with page:', page)
    
    try {
      const url = `https://tourism.surabaya.go.id/api/kominfo/event?page=${page}`
      console.log('📡 Fetching from URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📥 Response status:', response.status, response.statusText)
      console.log('📥 Response ok:', response.ok)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Data received:', {
        statusCode: data?. status?.code,
        statusMessage: data?.status?.message,
        eventsCount: data?.data?.data?.length,
        hasData: !!data?.data?.data
      })
      
      // Update cache
      if (data?.data?.data) {
        eventsCache = data. data.data
        cacheTimestamp = Date.now()
        console.log('💾 Cache updated with', eventsCache.length, 'events')
      } else {
        console.warn('⚠️ No data. data.data in response')
      }
      
      return data
    } catch (error) {
      console.error('❌ Error fetching events:', error)
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack'
      })
      
      // Jika ada cache dan masih valid, gunakan cache
      if (eventsCache.length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Using cached events data:', eventsCache.length, 'events')
        return {
          status: { code: 200, message: 'Data from cache' },
          data: {
            currentPage: page,
            data: eventsCache,
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
            total: eventsCache.length,
          }
        }
      }
      
      console.error('❌ No cache available, throwing error')
      throw error
    }
  }
  
  export async function getEventDetail(id: string): Promise<{ status: { code: number, message: string }, data: Event }> {
    try {
      console.log('🔍 Fetching event detail for ID:', id)
      
      // Cek cache dulu
      const now = Date.now()
      if (eventsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
        console.log('💾 Checking cache for event:', id)
        const cachedEvent = eventsCache.find(e => e.id === id)
        if (cachedEvent) {
          console.log('✅ Found in cache:', cachedEvent.nameIndonesia)
          return {
            status: { code: 200, message: 'Data from cache' },
            data: cachedEvent
          }
        }
      }
      
      // Fetch dari API
      console.log('📡 Fetching from API.. .')
      const response = await fetch(`https://tourism.surabaya.go.id/api/kominfo/event? page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ API Response status:', result.status)
      
      if (!result.data || !result.data.data) {
        throw new Error('Invalid API response structure')
      }
      
      // Update cache
      eventsCache = result.data.data
      cacheTimestamp = Date.now()
      
      // Find event by ID
      const event = result.data.data.find((e: Event) => e.id === id)
      console.log('🔍 Found event:', event ?  'Yes' : 'No')
      
      if (!event) {
        throw new Error(`Event with ID ${id} not found`)
      }
      
      return {
        status: result.status,
        data: event
      }
    } catch (error) {
      console.error('❌ Error fetching event detail:', error)
      
      // Last resort: cek cache meskipun expired
      if (eventsCache.length > 0) {
        console.log('💾 Checking expired cache as fallback')
        const cachedEvent = eventsCache.find(e => e.id === id)
        if (cachedEvent) {
          console.log('✅ Found in expired cache:', cachedEvent.nameIndonesia)
          return {
            status: { code: 200, message: 'Data from expired cache' },
            data: cachedEvent
          }
        }
      }
      
      throw error
    }
  }
  
  // Category mapping based on idKategoriEvent
  export const EVENT_CATEGORIES = {
    '1': 'Bazaar & Market',
    '2': 'Music & Entertainment',
    '3': 'Festival & Celebration',
    '4': 'Exhibition',
    '5': 'Seminar & Workshop',
    '6': 'Culture & Art',
    '7': 'Sport',
    '8': 'Other',
  }