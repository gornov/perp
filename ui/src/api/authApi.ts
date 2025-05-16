import typedAxios from '@/api/typedAxios'

const authApi = {
  getNonce(publicKey: string) {
    return typedAxios.post<{ nonce: string }>('/api/v1/auth/nonce', { public_key: publicKey })
  },

  verify(publicKey:string, signature: string) {
    return typedAxios.post<{ token: string }>('/api/v1/auth/verify', { public_key: publicKey, signature })
  }
}

export default authApi
