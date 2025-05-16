/// <reference types="vite/client" />

// vite-imagetools
declare module '*as=picture' {
  export default {
    sources: Record<string, string>,
    img: {
      src: string,
      w: number,
      h: number,
    },
  }
}
declare module '*as=url' {
  const url: string
  export default url
}
