export interface User {
  email: string
  image?: string
  profileImage?: string
  profileImageWidth?: string
  profileImageHeight?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Author {
  id: string
  name: string
  slug: string
}

export interface TagRelation {
  id: number
  sort: number
  tag: Tag
}

export type AuthorRelation = {
  id: number
  sort: number
  author: Author
}

export enum PostType {
  Page = 'PAGE',
  Post = 'POST',
}

export interface Post {
  id: string
  slug: string
  title: string
  featureImage: string | null
  featureImageWidth: number | null
  featureImageHeight: number | null
  featureImageBlur: string | null
  html: string
  excerpt: string
  canonicalUrl: string
  type: PostType
  tagRelations: TagRelation[]
  authorRelations: AuthorRelation[]
  publishedAt: Date
  updatedAt: Date
}

export type Page = Post

export type PostOrPage = Post | Page

export interface Navigation {
  sort: number
  label: string
  url: string
}

export type Social = Navigation

export interface Analytic {
  provider: string
  trackingId: string
}

export interface Settings {
  id: string
  title: string
  description: string
  descriptionHidden: boolean
  lang: string
  accent?: string
  brandLabel?: string
  brandUrl?: string
  iconImage?: string
  iconImageWidth?: string
  iconImageHeight?: string
  logoImage?: string
  logoImageWidth?: string
  logoImageHeight?: string
  url: string
  navigations: Navigation[]
  socials: Social[]
  analytics: Analytic[]
  updatedAt: Date
}

type PostSlugProjectIdCompoundUniqueInput = {
  slug: string
  projectId: string
}

type PostIdUserIdCompoundUniqueInput = {
  id: string
  userId: string
}

export type PostWhereUniqueInput = {
  slug_projectId?: PostSlugProjectIdCompoundUniqueInput
  id_userId?: PostIdUserIdCompoundUniqueInput
}

export type PageWhereUniqueInput = PostWhereUniqueInput

export interface Member {
  id: string
}
