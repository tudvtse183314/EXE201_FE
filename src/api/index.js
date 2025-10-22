// Export all API functions
export * from "./auth";
export * from "./axios";

export * from './accounts';
export * from './profile';
// thêm 2 dòng dưới:
export * from './products';
export * from './category';
export { default as default } from './axios';
export { setGlobalLoadingState } from './axios';
