/// <reference types="vite/client" />

declare module "*?arraybuffer" {
  const content: ArrayBuffer;
  export default content;
}
