const API_BASE_URL = "http://localhost/optic-proline.com/public/api"

interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (token) {
      headers.Authorization = token
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth APIs
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    })

    return this.handleResponse(response)
  }

  async register(companyData: any, userData: any) {
    const formData = new FormData()

    // Company data
    formData.append("company_name", companyData.name)
    formData.append("register_id", companyData.register_id)
    formData.append("address", companyData.address)
    formData.append("contact", companyData.contact)
    if (companyData.logo) {
      formData.append("logo", companyData.logo)
    }

    // User data
    formData.append("name", userData.name)
    formData.append("email", userData.email)
    formData.append("phone", userData.phone)
    formData.append("password", userData.password)
    formData.append("password_confirmation", userData.password_confirmation)
    if (userData.photo) {
      formData.append("photo", userData.photo)
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      body: formData,
    })

    return this.handleResponse(response)
  }

  // Products APIs
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return this.handleResponse(response)
  }

  // Orders APIs
  async getOrders(token: string) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "GET",
      headers: this.getHeaders(token),
    })

    return this.handleResponse(response)
  }

  async createOrder(orderData: any, token: string) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(orderData),
    })

    return this.handleResponse(response)
  }

  // Profile APIs
  async updateCompanyProfile(companyData: any, token: string) {
    const formData = new FormData()

    formData.append("register_id", companyData.register_id)
    formData.append("address", companyData.address)
    formData.append("contact", companyData.contact)
    if (companyData.logo) {
      formData.append("logo", companyData.logo)
    }

    const response = await fetch(`${API_BASE_URL}/company/profile`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    })

    return this.handleResponse(response)
  }

  async updateUserProfile(userData: any, token: string) {
    const formData = new FormData()

    formData.append("name", userData.name)
    formData.append("email", userData.email)
    formData.append("phone", userData.phone)
    if (userData.photo) {
      formData.append("photo", userData.photo)
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    })

    return this.handleResponse(response)
  }
}

export const apiClient = new ApiClient()
