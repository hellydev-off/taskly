import http from "./http";

export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  username: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export const authApi = {
  async register(
    email: string,
    username: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>("/auth/register", {
      email,
      username,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
        })
      );
    }

    return response.data;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>("/auth/login", {
      username,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
        })
      );
    }

    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? (JSON.parse(user) as User) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
