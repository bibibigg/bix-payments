export interface User {
  username: string;
  name: string;
}

export interface SignupRequest {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  name: string;
  username: string;
  iat: number;
  exp: number;
}

export interface ApiError {
  message: string;
  status: number;
}

// 게시판

export type BoardCategory = "NOTICE" | "FREE" | "QNA" | "ETC";

export interface BoardListItem {
  id: number;
  title: string;
  category: BoardCategory;
  createdAt: string;
}

export interface BoardDetail {
  id: number;
  title: string;
  content: string;
  boardCategory: BoardCategory;
  imageUrl: string | null;
  createdAt: string;
}

export interface PageSort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageSort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface BoardPage {
  content: BoardListItem[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: PageSort;
  first: boolean;
  empty: boolean;
}

export interface BoardRequest {
  title: string;
  content: string;
  category: BoardCategory;
}

export type CategoryMap = Record<BoardCategory, string>;
