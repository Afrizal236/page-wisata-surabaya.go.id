export default interface components {
  schemas: {
    Article: {
      id?: number
      title?: string
      feature_image_url?: string
      publish_date?: string
      slug?: string
      view_count?: number
      source?: number
      details?: components['schemas']['Detail'][]
      content?: string
      content_type?: string
    }
    Detail: {
      page?: number
      content?: string
    }
    Organization: {
      id?: number
      name?: string
      logo_url?: string
      about_us_title?: string
      description?: string
      profile_image_url?: string
      structure_title?: string
      structure_url?: string
      contact_title?: string
      address?: string
      whatsapp?: string
      phone_number?: string
      social_media_title?: string
      instagram?: string
      youtube?: string
      twitter?: string
      facebook?: string
      tiktok?: string
      service_title?: string
      news_title?: string
      info_title?: string
      slug?: string
      menu?: components['schemas']['Menu'][]
      sliders?: components['schemas']['Slider'][]
      footer?: components['schemas']['Attribute'][]
      social_media?: components['schemas']['Attribute'][]
    }
    Slider: {
      title?: string
      img?: string
      content?: string
      content_type?: string
      created_at?: string
      feature_image: string
      id: number
      id_lama?: number
      locale?: string
      name?: string
      parent_id?: number
      post_type?: string
      status?: string
      updated_at?: string
      user_id?: number
      viewed_count?: number
    }
    Menu: {
      title?: string
      value?: string
      url?: string
      level?: number
      order?: number
      icon?: string
      child?: components['schemas']['Menu'][]  
    }
    Attribute: {
      title?: string
      url?: string
      description?: number
      icon?: string
    }
    Service: {
      id: number
      title?: string
      description?: string
      url?: string
      feature_image_url?: string
      created_at?: string
    }
  }
}
